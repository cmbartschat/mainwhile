import {DefaultLogFields} from 'simple-git'

type ChangeMetadata = DefaultLogFields & {
  remaining: number
}

export {ChangeMetadata}
