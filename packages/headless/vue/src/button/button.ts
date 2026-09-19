import {
  connectButton,
  createButtonMachine,
  type ButtonApi,
  type ButtonProps as CoreButtonProps,
  type Direction,
} from "@kimak/core";
import {
  defineComponent,
  h,
  inject,
  provide,
  type InjectionKey,
  type PropType,
  type VNode,
} from "vue";
import { createKimakId } from "../create-id";
import { useDirection } from "../direction";
import { mergeProps } from "../merge-props";
import { normalizeProps, type VuePropTypes } from "../normalize-props";
import { useMachine } from "../use-machine";

type VueButtonApi = ButtonApi<VuePropTypes>;
type GetButtonApi = () => VueButtonApi;

const ButtonKey: InjectionKey<GetButtonApi> = Symbol("kimak-button");

function useButtonApi(): GetButtonApi {
  const getApi = inject(ButtonKey);
  if (!getApi) {
    throw new Error("[kimak] Button parts must be wrapped in Button.Root");
  }
  return getApi;
}

export const ButtonRoot = defineComponent({
  name: "KimakButtonRoot",
  inheritAttrs: false,
  props: {
    id: String,
    disabled: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    loading: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    focusableWhenDisabled: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    type: String as PropType<CoreButtonProps["type"]>,
    name: String,
    value: String,
    form: String,
    dir: String as PropType<Direction>,
    ids: Object as PropType<CoreButtonProps["ids"]>,
    onPress: Function as PropType<CoreButtonProps["onPress"]>,
    getRootNode: Function as PropType<CoreButtonProps["getRootNode"]>,
  },
  setup(props, { slots, attrs }) {
    const uid = createKimakId();
    const inheritedDir = useDirection();
    const service = useMachine(createButtonMachine, () => ({
      id: props.id ?? uid,
      disabled: props.disabled,
      loading: props.loading,
      focusableWhenDisabled: props.focusableWhenDisabled,
      type: props.type,
      name: props.name,
      value: props.value,
      form: props.form,
      dir: props.dir ?? inheritedDir,
      ids: props.ids,
      onPress: props.onPress,
      getRootNode: props.getRootNode,
    }));

    const getApi: GetButtonApi = () => connectButton(service, normalizeProps);
    provide(ButtonKey, getApi);

    return (): VNode => {
      const merged = mergeProps(getApi().getRootProps(), attrs);
      return h("button", merged, slots.default?.());
    };
  },
});

export const ButtonIndicator = defineComponent({
  name: "KimakButtonIndicator",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    const getApi = useButtonApi();
    return (): VNode => {
      const merged = mergeProps(getApi().getIndicatorProps(), attrs);
      return h("span", merged, slots.default?.());
    };
  },
});

export const Button = {
  Root: ButtonRoot,
  Indicator: ButtonIndicator,
};

export type ButtonRootProps = CoreButtonProps;
