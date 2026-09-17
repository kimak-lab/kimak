import plugin from "tailwindcss/plugin";
import { checkboxRecipe } from "./checkbox";
import { dialogRecipe } from "./dialog";
import { themeBase } from "./theme";

export default plugin(({ addBase }) => {
  addBase(themeBase);
  addBase({
    ...checkboxRecipe(),
    ...dialogRecipe(),
  });
});
