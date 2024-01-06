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
import {
  WorldInfoT,
  worldComponentsT,
  loader as worldLoader
} from "../generate-world";
import { InventoryT, TroveToken } from "~/api.server";
import {
  usePrepareSmolWorldCheckSmolIntoSmolWorld,
  usePrepareSmolWorldCheckSmolOutOfSmolWorld,
  usePrepareSmolWorldUnlockComponent,
  usePrepareSmolWorldUpgradeComponent,
  useSmolWorldCheckSmolIntoSmolWorld,
  useSmolWorldCheckSmolOutOfSmolWorld,
  useSmolWorldUnlockComponent,
  useSmolWorldUpgradeComponent
} from "~/generated";
import { useContractAddresses } from "~/useChainAddresses";
import { useWaitForTransaction } from "wagmi";
import { TransactionReceipt, decodeEventLog } from "viem";
import * as ABIS from "~/artifacts";
import { useFetcher } from "~/hooks/useFetcher";

type InitialStateT = {
  worldId: string;
  world: WorldInfoT;
  inventory: InventoryT | null;
  selectedComponent: worldComponentsT[number] | null;
};

interface ComponentStateT extends InitialStateT {
  component: worldComponentsT[number];
}

interface SmolStateT extends InitialStateT {
  smolId: string;
}

const states = createStates({
  IDLE: (initialState: InitialStateT) => ({
    ...initialState
  }),
  RELOADING: (initialState: InitialStateT) => ({
    ...initialState
  }),
  CHECKING_SMOL_IN: (state: SmolStateT) => ({
    ...state
  }),
  CHECKING_SMOL_OUT: (state: SmolStateT) => ({
    ...state
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
  upgradeComponentSuccess: (componentId: string, newLevel: number) => ({
    componentId,
    newLevel
  }),
  checkSmolIn: (smolId: string) => ({ smolId }),
  checkInSmolSuccess: (smolId: string) => ({ smolId }),
  checkSmolOut: (smolId: string) => ({ smolId }),
  checkOutSmolSuccess: () => ({}),
  reload: () => ({}),
  reloaded: (world: WorldInfoT) => ({ world }),
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
        states.UPGRADING_COMPONENT({ ...ctx, component }),
      reload: (ctx) => states.RELOADING({ ...ctx }),
      checkSmolIn: (ctx, { smolId }) =>
        states.CHECKING_SMOL_IN({ ...ctx, smolId }),
      checkSmolOut: (ctx, { smolId }) =>
        states.CHECKING_SMOL_OUT({ ...ctx, smolId })
    },
    CHECKING_SMOL_IN: {
      checkInSmolSuccess: (ctx, { smolId }) => {
        ctx.world.checkedInSmol = smolId;
        return states.IDLE({ ...ctx });
      },
      error: (ctx) => states.IDLE({ ...ctx })
    },
    CHECKING_SMOL_OUT: {
      checkOutSmolSuccess: (ctx) => {
        ctx.world.checkedInSmol = null;
        ctx.selectedComponent = null;
        return states.IDLE({ ...ctx });
      },
      error: (ctx) => states.IDLE({ ...ctx })
    },
    RELOADING: {
      reloaded: (ctx, { world }) => states.IDLE({ ...ctx, world }),
      error: (ctx) => states.IDLE({ ...ctx })
    },
    UNLOCKING_COMPONENT: {
      unlockComponentSuccess: (ctx, { componentId }) => {
        const targetComponent = ctx.world.worldComponents.find(
          (component) => component.id === componentId
        );

        if (targetComponent) {
          targetComponent.isUnlocked = true;
          targetComponent.canUnlock = false;
        }

        return states.IDLE({ ...ctx });
      },
      error: (ctx) => states.IDLE({ ...ctx })
    },
    UPGRADING_COMPONENT: {
      upgradeComponentSuccess: (ctx, { componentId, newLevel }) => {
        const targetComponent = ctx.world.worldComponents.find(
          (component) => component.id === componentId
        );

        if (targetComponent) {
          targetComponent.level = newLevel;
          targetComponent.canUpgrade = false;
        }

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

  const [worldFetcherRef, worldFetcher] = useFetcher<typeof worldLoader>();

  const [state, dispatch] = worldReducer;
  const contractAddresses = useContractAddresses();

  // smol check-in
  const smolId = matchProp(state, "smolId")?.smolId;

  const { config: checkInSmolConfig, status: checkInSmolStatus } =
    usePrepareSmolWorldCheckSmolIntoSmolWorld({
      address: contractAddresses["SMOL_WORLD"],
      args: [BigInt(smolId ?? 0), BigInt(state.worldId)],
      enabled: !!smolId && state.state === "CHECKING_SMOL_IN"
    });

  const checkInSmol = useSmolWorldCheckSmolIntoSmolWorld(checkInSmolConfig);

  const checkInSmolResult = useWaitForTransaction(checkInSmol.data);

  useEnter(
    state,
    "CHECKING_SMOL_IN",
    () => {
      if (checkInSmol.status === "idle") {
        checkInSmol.write?.();
      }
    },
    [checkInSmol.write, checkInSmol.status]
  );

  useEffect(() => {
    if (checkInSmolResult.status === "success" && checkInSmolResult.data) {
      const data = checkInSmolResult.data;

      const result = data.logs
        .filter(
          ({ address }) =>
            address === contractAddresses["SMOL_WORLD"].toLowerCase()
        )
        .map(({ data, topics }) =>
          decodeEventLog({
            strict: false,
            abi: ABIS.SMOL_WORLD,
            eventName: "SmolCheckedIn",
            data,
            topics
          })
        )
        .find(({ eventName }) => eventName === "SmolCheckedIn");

      dispatch({
        type: "checkInSmolSuccess",
        smolId: String(result?.args.smolId ?? 0)
      });

      checkInSmol.reset();
    }
  }, [checkInSmolResult.status, checkInSmolResult.data, checkInSmol.reset]);

  useEffect(() => {
    if (checkInSmolStatus === "error" || checkInSmol.status === "error") {
      dispatch({ type: "error" });
    }
  }, [checkInSmolStatus, checkInSmol.status, dispatch]);

  // smol check-out
  const { config: checkOutSmolConfig, status: checkOutSmolStatus } =
    usePrepareSmolWorldCheckSmolOutOfSmolWorld({
      address: contractAddresses["SMOL_WORLD"],
      args: [BigInt(smolId ?? 0)],
      enabled: !!smolId && state.state === "CHECKING_SMOL_OUT"
    });

  const checkOutSmol = useSmolWorldCheckSmolOutOfSmolWorld(checkOutSmolConfig);

  const checkOutSmolResult = useWaitForTransaction(checkOutSmol.data);

  useEnter(
    state,
    "CHECKING_SMOL_OUT",
    () => {
      if (checkOutSmol.status === "idle") {
        checkOutSmol.write?.();
      }
    },
    [checkOutSmol.write, checkOutSmol.status]
  );

  useEffect(() => {
    if (checkOutSmolResult.status === "success" && checkOutSmolResult.data) {
      dispatch({
        type: "checkOutSmolSuccess"
      });

      checkOutSmol.reset();
    }
  }, [checkOutSmolResult.status, checkOutSmolResult.data, checkOutSmol.reset]);

  useEffect(() => {
    if (checkOutSmolStatus === "error" || checkOutSmol.status === "error") {
      dispatch({ type: "error" });
    }
  }, [checkOutSmolStatus, checkOutSmol.status, dispatch]);

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

  // upgrade component
  const { config: upgradeComponentConfig, status: upgradeComponentStatus } =
    usePrepareSmolWorldUpgradeComponent({
      address: contractAddresses["SMOL_WORLD"],
      args: [BigInt(state.worldId), BigInt(targetComponent?.id ?? 0)],
      enabled:
        !!targetComponent &&
        targetComponent.isUnlocked &&
        targetComponent.canUpgrade
    });

  const upgradeComponent = useSmolWorldUpgradeComponent(upgradeComponentConfig);

  const upgradeComponentResult = useWaitForTransaction(upgradeComponent.data);

  useEnter(
    state,
    "UPGRADING_COMPONENT",
    () => {
      upgradeComponent.write?.();
    },
    [upgradeComponent.write]
  );

  useEffect(() => {
    if (
      upgradeComponentResult.status === "success" &&
      upgradeComponentResult.data
    ) {
      const data = upgradeComponentResult.data;

      const result = data.logs
        .filter(
          ({ address }) =>
            address === contractAddresses["SMOL_WORLD"].toLowerCase()
        )
        .map(({ data, topics }) =>
          decodeEventLog({
            strict: false,
            abi: ABIS.SMOL_WORLD,
            eventName: "ComponentUpgraded",
            data,
            topics
          })
        )
        .find(
          ({ eventName, args }) =>
            eventName === "ComponentUpgraded" &&
            Number(args.componentId) ===
              Number(state.selectedComponent?.id ?? 0)
        );

      console.log({ result });

      dispatch({
        type: "upgradeComponentSuccess",
        componentId: String(result?.args.componentId ?? 0),
        newLevel: Number(result?.args.newLevel ?? 0)
      });

      upgradeComponent.reset();
    }
  }, [
    state.selectedComponent?.id,
    upgradeComponentResult.status,
    upgradeComponentResult.data,
    upgradeComponent.reset
  ]);

  useEffect(() => {
    if (
      upgradeComponentStatus === "error" ||
      upgradeComponent.status === "error"
    ) {
      dispatch({ type: "error" });
    }
  }, [upgradeComponentStatus, upgradeComponent.status, dispatch]);

  // reload
  useEnter(
    state,
    "RELOADING",
    ({ worldId }) => {
      if (worldFetcher.state === "idle") {
        if (!worldFetcher.data) {
          worldFetcherRef.load(`/generate-world?worldTokenId=${worldId}`);
        } else {
          if (worldFetcher.data.ok) {
            dispatch({ type: "reloaded", world: worldFetcher.data.data });
            return;
          }

          dispatch({ type: "error" });
        }
      }
    },
    [worldFetcher.state, worldFetcher.data]
  );

  // clear fetcher data on successful reload
  useTransition(state, "RELOADING => reloaded => IDLE", () => {
    worldFetcher.submit({}, { action: "/reset-fetcher", method: "post" });
  });

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
