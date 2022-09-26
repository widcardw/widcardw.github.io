// // @ts-expect-error type declaration
// import glsl from 'vue-glsl'
import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, app }) => {
  if (!isClient)
    return

  import('vue-glsl').then((glsl) => {
    app.use(glsl.default)
  })
}
