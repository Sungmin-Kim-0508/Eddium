import 'reflect-metadata'
import app from "./app"

app().catch(err => {
  console.log(err)
})