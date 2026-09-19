import plugin from "tailwindcss/plugin";
import { buttonRecipe } from "./button.recipe";
import { buttonGroupRecipe } from "./button-group.recipe";
import { spinnerRecipe } from "./spinner.recipe";

export default plugin(({ addBase }) => {
  addBase({
    ...buttonRecipe(),
    ...spinnerRecipe(),
    ...buttonGroupRecipe(),
  });
});
