// See https://spin.atomicobject.com/2020/01/30/jest-add-custom-functions/

import { MountingOptions } from "@vue/test-utils"

import merge from "lodash/merge"

export function spyOnHandler(
  mountingOptions: MountingOptions<any, any>,
  errorSpy?: jest.Mock<any, any>,
  warnSpy?: jest.Mock<any, any>,
): MountingOptions<any, any> {
  const mergedMountingOptions = merge(mountingOptions, {
    global: {
      config: {
        ...(errorSpy && { errorHandler: errorSpy }),
        ...(warnSpy && { warnHandler: warnSpy }),
      },
    },
  })
  return mergedMountingOptions
}

export function expectErrorOccured(
  errorSpy: jest.Mock<any, any>,
  expectHaveBeenCalledTimes?: number,
  message?: string,
  source?: string,
) {
  expectOccured(errorSpy, expectHaveBeenCalledTimes, message, source)
}

export function expectWarnOccured(
  warnSpy: jest.Mock<any, any>,
  expectHaveBeenCalledTimes?: number,
  message?: string,
  source?: string,
) {
  expectOccured(warnSpy, expectHaveBeenCalledTimes, message, source)
}

function expectOccured(
  spy: jest.Mock<any, any>,
  expectHaveBeenCalledTimes?: number,
  message?: string,
  source?: string,
) {
  let error: Error = spy.mock.calls[0]?.[0]
  logError(error)
  expect(error).toBeInstanceOf(Error)
  if (expectHaveBeenCalledTimes)
    expect(spy).toHaveBeenCalledTimes(expectHaveBeenCalledTimes)
  if (message) expect(error).toHaveProperty("message", message)
  if (source) expect(spy.mock.calls[0][2]).toBe(source)
}

export function expectNoErrorOrWarnOccured(
  errorSpy?: jest.Mock<any, any>,
  warnSpy?: jest.Mock<any, any>,
) {
  let error: Error | undefined = undefined
  let warn: Error | undefined = undefined
  if (errorSpy) {
    error = errorSpy.mock.calls[0]?.[0]
    logError(error)
  }
  if (warnSpy) {
    warn = warnSpy.mock.calls[0]?.[0]
    logWarn(warn)
  }
  expect([error, warn]).toEqual([undefined, undefined])
}

function logError(error?: Error) {
  error ? console.info("Vue' caught error is >> ", error) : () => {}
}

function logWarn(error?: Error) {
  error ? console.info("Vue' caught warn is >> ", error) : () => {}
}
