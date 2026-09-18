import plugin from "tailwindcss/plugin";
import { buttonRecipe } from "./button.recipe";
import { checkboxRecipe } from "./checkbox.recipe";
import { dialogRecipe } from "./dialog.recipe";

export default plugin(({ addBase }) => {
  addBase({
    ...buttonRecipe(),
    ...checkboxRecipe(),
    ...dialogRecipe(),
  });
});
