import plugin from "tailwindcss/plugin";
import { buttonRecipe } from "./button.recipe";

export default plugin(({ addBase }) => {
  addBase({
    ...buttonRecipe(),
  });
});
