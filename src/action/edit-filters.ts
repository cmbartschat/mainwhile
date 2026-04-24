import {Ctx} from '../ctx.js'
import open from 'open'
import fs from 'fs/promises'

const editFilters = async (ctx: Ctx) => {
  try {
    await fs.writeFile(ctx.configPath, '\n', {flag: 'wx'})
  } catch (err) {
    if ((err as {code: string}).code !== 'EEXIST') {
      throw err
    }
  }

  await open(ctx.configPath)
}

export {editFilters}
