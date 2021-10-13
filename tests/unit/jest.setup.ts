// See https://spin.atomicobject.com/2020/01/30/jest-add-custom-functions/

import { MountingOptions } from "@vue/test-utils"

import merge from "lodash/merge"

export function spyOnErrorHandler(
  mountingOptions: MountingOptions<any, any>,
  errorSpy: jest.Mock<any, any>,
) {
  return merge(mountingOptions, {
    global: {
      config: { errorHandler: errorSpy },
    },
  })
}

export function expectErrorOccured(
  errorSpy: jest.Mock<any, any>,
  expectHaveBeenCalledTimes?: number,
  message?: string,
  source?: string,
) {
  let error: Error = errorSpy.mock.calls[0]?.[0]
  logError(error)
  expect(error).toBeInstanceOf(Error)
  if (expectHaveBeenCalledTimes)
    expect(errorSpy).toHaveBeenCalledTimes(expectHaveBeenCalledTimes)
  if (message) expect(error).toHaveProperty("message", message)
  if (source) expect(errorSpy.mock.calls[0][2]).toBe(source)
}

export function expectNoErrorOccured(errorSpy: jest.Mock<any, any>) {
  let error: Error = errorSpy.mock.calls[0]?.[0]
  if (error) logError(error)
  expect(error).toBeUndefined()
}

function logError(error: Error) {
  error ? console.info("Vue' caught error is >> ", error) : () => {}
}
