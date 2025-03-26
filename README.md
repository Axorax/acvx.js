# `acvx` - **A**tomic **C**lass **V**ariant e**X**pressions

Tiny library to deal with class names. You can use it with Tailwind CSS to create components like ShadCN does.

It's a combination of clsx and cva with all features from both but reduced bundle size and improved performance.

Works on **browser**, **commonjs** and **ES6**. Zero dependencies.

Documentation: [Full Usage Guide](https://github.com/Axorax/acvx.js/blob/main/USAGE.md)

```js
import {ax, av} from "acvx";

const redColor = true;

const buttonVariants = av("bg-blue-500", {
  "variants": {
    "bg": {
      "blue": "bg-blue-500",
      "red": "bg-red-300"
    }
  },
  "defaultVariants": {
    "bg": "blue"
  }
});

// For h1, "text-2xl text-red-500" as redColor is true
// For button, bg depends on the variant used

const App = ({bg}) => {
  return <>
    <h1 className={ax("text-2xl", {
      "text-red-500": redColor
    })}>Hello</h1>

    <button className={buttonVariants({bg})}>world</button>
  </>
}

export default App
```

---

<p align="center">
    <a href="https://github.com/Axorax/socials">Socials + Donate</a>
</p>
