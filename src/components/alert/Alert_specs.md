- The alerts should be used in a functional way
- Usually only one alert should be active at a time, but do create a support for multiple instances, on a pinia store as a stack

- Call syntax should look like this:

```ts


type arm = String | {key: String, label: String, style: String}

interface Actions {
    "ok": () => {},
    "cancel": () => {}
    [arm]: {handler: ()=>{}, label?: String, variant?: ButtonVariant}
},

Alert.open(icon, #aaaaaa, "message", "Actions") // user can provide icon and decide on the theme color

Alert.info(message: string, actions: Actions)

```

with the following usage examples



```ts

Alert.info("message", {
  "ok": () => {}
  "cancel": ()=>{}

  ["custom"]: {handler: ()=> {  }, label: "Custom", "info"}
})
// laso allow optionally, doing .then and .catch at the end (this runs after the defined handlers)


Alert.open("")

```

# make ok and cancel be aliased with "confirm" and "close" by default, allow only

- Automatically create the constructors for the different variants according to theme variables, try to do it dynamically or use

- Allow async promise handling

- Visual design
  - Icon (appropriate according to context), on the left of the message
  - Message in big text (not too big)
  - Details underneeth in a smaller and non bold font
  - use theme colors for the different alert preset types
  - 
