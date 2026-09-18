import plugin from "tailwindcss/plugin";
import { buttonRecipe } from "./button";
import { checkboxRecipe } from "./checkbox";
import { dialogRecipe } from "./dialog";
import { themeBase } from "./theme";

export default plugin(({ addBase }) => {
  addBase(themeBase);
  addBase({
    ...buttonRecipe(),
    ...checkboxRecipe(),
    ...dialogRecipe(),
  });
});
