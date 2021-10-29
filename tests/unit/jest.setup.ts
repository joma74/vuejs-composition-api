// See https://spin.atomicobject.com/2020/01/30/jest-add-custom-functions/

import { MountingOptions } from "@vue/test-utils"
import { Component } from "@vue/runtime-core"
import chalk from "chalk"
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
  let errorCallParams: [[Error, Component, string]] | undefined = undefined
  let warnCallParams: [[string, Component, string]] | undefined = undefined
  if (errorSpy) {
    errorCallParams = errorSpy.mock.calls as [[Error, any, string]]
    logErrorCallParam(errorCallParams)
  }
  if (warnSpy) {
    warnCallParams = warnSpy.mock.calls as [[string, any, string]]
    logWarnCallParam(warnCallParams)
  }
  // !!! errorCallParams as expected gives indefinite recursion in jest print; @ReactTestComponent#serialize
  expect([
    errorCallParams === undefined,
    warnCallParams === undefined,
  ]).toEqual([true, true])
}

function logErrorCallParam(errorCallParams?: [[Error, any, string]]) {
  errorCallParams
    ? errorCallParams.forEach((itemTuple) =>
        logError(itemTuple[0], itemTuple[2]),
      )
    : () => {}
}

function logWarnCallParam(warnCallParams?: [[string, any, string]]) {
  warnCallParams
    ? warnCallParams.forEach((itemTuple) => logWarn(itemTuple[0], itemTuple[2]))
    : () => {}
}

function logError(error?: Error, _location?: string) {
  console.info(
    chalk.red(
      `Vue' caught error is >> ${error?.stack}\nlocated at >> ${_location}`,
    ),
  )
}

function logWarn(msg?: string, stack?: string) {
  console.info(chalk.yellow(`Vue' caught warn is >> ${msg}\n${stack}`))
}
