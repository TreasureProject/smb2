import { useReducer, useEffect } from "react";
import {
  ActionsUnion,
  StatesUnion,
  TTransition,
  TTransitions,
  createActions,
  createStates,
  matchProp,
  transition,
  useEnter,
  useTransition
} from "react-states";
import { WorldInfoT, worldComponentsT } from "../generate-world";
import { InventoryT } from "~/api.server";
import {
  usePrepareSmolWorldUnlockComponent,
  useSmolWorldUnlockComponent
} from "~/generated";
import { useContractAddresses } from "~/useChainAddresses";
import { useWaitForTransaction } from "wagmi";
import { TransactionReceipt, decodeEventLog } from "viem";
import * as ABIS from "~/artifacts";

type InitialStateT = {
  worldId: string;
  world: WorldInfoT;
  inventory: InventoryT | null;
  selectedComponent: worldComponentsT[number] | null;
};

interface ComponentStateT extends InitialStateT {
  component: worldComponentsT[number];
}

const states = createStates({
  IDLE: (initialState: InitialStateT) => ({
    ...initialState
  }),
  UNLOCKING_COMPONENT: (state: ComponentStateT) => ({ ...state }),
  UPGRADING_COMPONENT: (state: ComponentStateT) => ({ ...state })
});

type State = StatesUnion<typeof states>;

const actions = createActions({
  selectComponent: (component: worldComponentsT[number]) => ({ component }),
  unlockComponent: (component: worldComponentsT[number]) => ({ component }),
  upgradeComponent: (component: worldComponentsT[number]) => ({ component }),
  unlockComponentSuccess: (componentId: string) => ({ componentId }),
  upgradeComponentSuccess: (componentId: string) => ({ componentId }),
  error: () => ({})
});

type Action = ActionsUnion<typeof actions>;

const reducer = (state: State, action: Action) =>
  transition(state, action, {
    IDLE: {
      selectComponent: (ctx, { component }) =>
        states.IDLE({ ...ctx, selectedComponent: component }),
      unlockComponent: (ctx, { component }) =>
        states.UNLOCKING_COMPONENT({ ...ctx, component }),
      upgradeComponent: (ctx, { component }) =>
        states.UPGRADING_COMPONENT({ ...ctx, component })
    },
    UNLOCKING_COMPONENT: {
      unlockComponentSuccess: (ctx, { componentId }) => {
        const targetComponent = ctx.world.worldComponents.find(
          (component) => component.id === componentId
        );

        if (targetComponent) targetComponent.isUnlocked = true;

        return states.IDLE({ ...ctx });
      },
      error: (ctx) => states.IDLE({ ...ctx })
    },
    UPGRADING_COMPONENT: {
      upgradeComponentSuccess: (ctx, { componentId }) => {
        const targetComponent = ctx.world.worldComponents.find(
          (component) => component.id === componentId
        );

        if (targetComponent) targetComponent.level += 1;

        return states.IDLE({ ...ctx });
      },
      error: (ctx) => states.IDLE({ ...ctx })
    }
  });

export const useWorldReducer = (initialState: {
  worldId: string;
  world: WorldInfoT;
  inventory: InventoryT | null;
}) => {
  const worldReducer = useReducer(reducer, {
    state: "IDLE",
    selectedComponent: null,
    ...initialState
  });

  const [state, dispatch] = worldReducer;
  const contractAddresses = useContractAddresses();

  // unlock component
  const targetComponent = matchProp(state, "selectedComponent")
    ?.selectedComponent;

  const { config: unlockComponentConfig, status: unlockComponentStatus } =
    usePrepareSmolWorldUnlockComponent({
      address: contractAddresses["SMOL_WORLD"],
      args: [BigInt(state.worldId), BigInt(targetComponent?.id ?? 0)],
      enabled:
        !!targetComponent &&
        !targetComponent.isUnlocked &&
        targetComponent.canUnlock
    });

  const unlockComponent = useSmolWorldUnlockComponent(unlockComponentConfig);

  const unlockComponentResult = useWaitForTransaction(unlockComponent.data);

  useEnter(
    state,
    "UNLOCKING_COMPONENT",
    () => {
      unlockComponent.write?.();
    },
    [unlockComponent.write]
  );

  useEffect(() => {
    if (
      unlockComponentResult.status === "success" &&
      unlockComponentResult.data
    ) {
      const data = unlockComponentResult.data;

      const result = data.logs
        .filter(
          ({ address }) =>
            address === contractAddresses["SMOL_WORLD"].toLowerCase()
        )
        .map(({ data, topics }) =>
          decodeEventLog({
            strict: false,
            abi: ABIS.SMOL_WORLD,
            eventName: "ComponentUnlocked",
            data,
            topics
          })
        )
        .find(
          ({ eventName, args }) =>
            eventName === "ComponentUnlocked" &&
            Number(args.componentId) ===
              Number(state.selectedComponent?.id ?? 0)
        );

      dispatch({
        type: "unlockComponentSuccess",
        componentId: String(result?.args.componentId ?? 0)
      });

      unlockComponent.reset();
    }
  }, [
    unlockComponentResult.status,
    unlockComponentResult.data,
    unlockComponent.reset
  ]);

  useEffect(() => {
    if (
      unlockComponentStatus === "error" ||
      unlockComponent.status === "error"
    ) {
      dispatch({ type: "error" });
    }
  }, [unlockComponentStatus, unlockComponent.status, dispatch]);

  useTransition(
    state,
    [
      "UNLOCKING_COMPONENT => error => IDLE",
      "UPGRADING_COMPONENT => error => IDLE"
    ],
    (ctx) => {
      // TODO: toast error
    }
  );

  // reload godot on successful unlock/upgrade
  useTransition(
    state,
    [
      "UNLOCKING_COMPONENT => unlockComponentSuccess => IDLE",
      "UPGRADING_COMPONENT => upgradeComponentSuccess => IDLE"
    ],
    (ctx) => {
      window.godotEmitter.emit("webpage", "selected_land", ctx.worldId);
    }
  );

  return worldReducer;
};
