export interface WriteError {
  code: number
  message: string
}

export interface InsertResponse {
  nInserted: number
  writeError?: WriteError
}

export interface UpdateResponse {
  nModified: number
  writeError?: WriteError
}

export interface DeleteResponse {
  deletedCount: number
}

export interface CollectionOptions {
  database: string
  collection: string
}

export interface CollectionInsertOptions extends CollectionOptions {
  document: any | any[]
}
