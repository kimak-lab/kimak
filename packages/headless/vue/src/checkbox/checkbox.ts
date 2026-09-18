import {
  connectCheckbox,
  createCheckboxMachine,
  type CheckboxApi,
  type CheckboxProps as CoreCheckboxProps,
  type CheckedState,
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

type VueCheckboxApi = CheckboxApi<VuePropTypes>;
type GetCheckboxApi = () => VueCheckboxApi;

const CheckboxKey: InjectionKey<GetCheckboxApi> = Symbol("kimak-checkbox");

function useCheckboxApi(): GetCheckboxApi {
  const getApi = inject(CheckboxKey);
  if (!getApi) {
    throw new Error("[kimak] Checkbox parts must be wrapped in Checkbox.Root");
  }
  return getApi;
}

const checkedProp = [Boolean, String] as PropType<CheckedState | undefined>;

export const CheckboxRoot = defineComponent({
  name: "KimakCheckboxRoot",
  inheritAttrs: false,
  props: {
    id: String,
    checked: { type: checkedProp, default: undefined },
    defaultChecked: { type: checkedProp, default: undefined },
    disabled: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    invalid: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    required: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    readOnly: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    name: String,
    form: String,
    value: String,
    dir: String as PropType<Direction>,
    ids: Object as PropType<CoreCheckboxProps["ids"]>,
    onCheckedChange: Function as PropType<CoreCheckboxProps["onCheckedChange"]>,
    getRootNode: Function as PropType<CoreCheckboxProps["getRootNode"]>,
  },
  setup(props, { slots, attrs }) {
    const uid = createKimakId();
    const inheritedDir = useDirection();
    const service = useMachine(createCheckboxMachine, () => ({
      id: props.id ?? uid,
      checked: props.checked,
      defaultChecked: props.defaultChecked,
      disabled: props.disabled,
      invalid: props.invalid,
      required: props.required,
      readOnly: props.readOnly,
      name: props.name,
      form: props.form,
      value: props.value,
      dir: props.dir ?? inheritedDir,
      ids: props.ids,
      onCheckedChange: props.onCheckedChange,
      getRootNode: props.getRootNode,
    }));

    const getApi: GetCheckboxApi = () => connectCheckbox(service, normalizeProps);
    provide(CheckboxKey, getApi);

    return (): VNode => {
      const merged = mergeProps(getApi().getRootProps(), attrs);
      return h("label", merged, slots.default?.());
    };
  },
});

export const CheckboxLabel = defineComponent({
  name: "KimakCheckboxLabel",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    const getApi = useCheckboxApi();
    return (): VNode => h("span", mergeProps(getApi().getLabelProps(), attrs), slots.default?.());
  },
});

export const CheckboxControl = defineComponent({
  name: "KimakCheckboxControl",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    const getApi = useCheckboxApi();
    return (): VNode => h("span", mergeProps(getApi().getControlProps(), attrs), slots.default?.());
  },
});

export const CheckboxIndicator = defineComponent({
  name: "KimakCheckboxIndicator",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    const getApi = useCheckboxApi();
    return (): VNode =>
      h("span", mergeProps(getApi().getIndicatorProps(), attrs), slots.default?.());
  },
});

export const CheckboxHiddenInput = defineComponent({
  name: "KimakCheckboxHiddenInput",
  inheritAttrs: false,
  setup(_props, { attrs }) {
    const getApi = useCheckboxApi();
    return (): VNode => h("input", mergeProps(getApi().getHiddenInputProps(), attrs));
  },
});

export const Checkbox = {
  Root: CheckboxRoot,
  Label: CheckboxLabel,
  Control: CheckboxControl,
  Indicator: CheckboxIndicator,
  HiddenInput: CheckboxHiddenInput,
};

export type CheckboxRootProps = CoreCheckboxProps;
