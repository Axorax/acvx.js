# `acvx` - Usage Guide

## ✨ Installation

```sh
npm i acvx
```

## 📜 Usage

### Import

#### ES6

```js
import { ax, av } from "acvx";
```

#### Commonjs

```js
const { ax, av } = require("./acvx.cjs");
```

#### Web

```html
<script type="module">
import { ax, av } from "https://www.unpkg.com/acvx@0.0.2/acvx.js";
</script>
```

### ax - Use classes conditionally

It works like clsx. Example from [clsx](https://www.npmjs.com/package/clsx).

```js
// Strings (variadic)
ax('foo', true && 'bar', 'baz');
// => 'foo bar baz'

// Objects
ax({ foo:true, bar:false, baz:isTrue() });
// => 'foo baz'

// Objects (variadic)
ax({ foo:true }, { bar:false }, null, { '--foobar':'hello' });
// => 'foo --foobar'

// Arrays
ax(['foo', 0, false, 'bar']);
// => 'foo bar'

// Arrays (variadic)
ax(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]]);
// => 'foo bar baz hello there'

// Kitchen sink (with nesting)
ax('foo', [1 && 'bar', { baz:false, bat:null }, ['hello', ['world']]], 'cya');
// => 'foo bar hello world cya'
```

### av - Use classes based on variant

It works like cva.

`defaultVariants` and `defaults` are the same. `compoundVariants` and `compounds` are the same. So, you can use either of those. However, if both are provided, `defaults` and `compounds` have higher priority. You can also use "className" instead of "class".

```js
const alertVariants = av("p-4 shadow", {
  variants: {
    variant: {
      default: ["text-blue-800", "border-blue-500"],
      success: "text-green-800",
      warning: ["text-yellow-800", {
        "bg-yellow-300": true // Conditional class (like ax)
      }],
      error: {
        "text-red-800": true
      },
    },
    dismissible: {
      true: "pr-10 relative",
      false: null,
    },
    theme: {
      light: "border-l-4",
      solid: "border",
    },
  },
  compoundVariants: [
    {
      variant: ["error", "warning"],// "error" or "warning"
      theme: "solid",
      class: "border-red-700",
    },
    {
      variant: "success",
      dismissible: true,
      class: "border-green-500", // Or, you can use "className"
    }
  ],
  defaultVariants: {
    variant: "default",
    dismissible: false,
    theme: "light",
  },
});

// Example usage:
console.log(alertVariants());
// => "p-4 shadow text-blue-800 border-blue-500 border-l-4"

console.log(alertVariants({ variant: "error", theme: "solid" }));
// => "p-4 shadow text-red-800 border border-red-700"

console.log(alertVariants({ variant: "success", dismissible: true }));
// => "p-4 shadow text-green-800 pr-10 relative border-l-4 border-green-500"

console.log(alertVariants({ variant: "warning" }));
// => "p-4 shadow text-yellow-800 bg-yellow-300 border-l-4"
```

Compound variants apply when the conditions for the other ones specified are met.

The first argument is the base style that'll be applied everytime.

---

<p align="center">
    <a href="https://github.com/Axorax/socials">Socials + Donate</a>
</p>
