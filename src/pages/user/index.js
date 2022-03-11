import { a } from "./a";
import { b } from "./b";
import { c } from "./dir/c";
import { x } from "../../common/x";

const User = () => {
  console.log(a, b, c, x);
  return null;
};

export default User;
