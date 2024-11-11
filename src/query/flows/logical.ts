import { createMatcher } from '../createMatcher.js'
import { fieldSelector } from '../fieldSelector.js'
import logical, { LogicalOperands } from '../logical/index.js'
import operators from '../operators/index.js'
import { cond, T } from '../../utils/cond.js'
import { composeArgs } from '../../utils/composeArgs.js'
import { ruleIsArray, ruleIsSimple } from '../utils/checks.js'
import { makeDevMatcher, makeMatcher } from '../utils/makeMatcher.js'
import { buildFilter, buildFilterDev } from '../buildFilter.js'
import { Schema, SchemaPart, setInSchema } from '../utils/Schema.js'

export const logicalFlowDev = cond([
  [
    ruleIsArray,
    composeArgs(
      makeDevMatcher(
        (
          operator: LogicalOperands,
          rule: any[],
          schema: Schema,
          key: string | undefined,
        ) => {
          // @ts-ignore
          const part: SchemaPart[] = schema[operator]
          const matchers = rule.map((line) => {
            const lineSchema = {}
            part.push(lineSchema)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return buildFilterDev(line, undefined, lineSchema)
          })
          return createMatcher(logical[operator](matchers), fieldSelector(key))
        },
      ),
      setInSchema(() => []),
    ),
  ],
  [
    T,
    composeArgs(
      cond([
        [
          ruleIsSimple,
          makeDevMatcher(
            (
              operator: LogicalOperands,
              rule: any,
              schema: Schema,
              key: string | undefined,
            ) =>
              createMatcher(
                logical[operator](
                  createMatcher(operators.$eq(rule), fieldSelector(undefined)),
                ),
                fieldSelector(key),
              ),
          ),
        ],
        [
          T,
          makeDevMatcher(
            (
              operator: LogicalOperands,
              rule: any,
              schema: Schema,
              key: string | undefined,
            ) =>
              createMatcher(
                logical[operator](
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  buildFilterDev(rule, undefined, schema[operator]),
                ),
                fieldSelector(key),
              ),
          ),
        ],
      ]),
      setInSchema(),
    ),
  ],
])

export const logicalFlow = cond([
  [
    ruleIsArray,
    makeMatcher(
      (operator: LogicalOperands, rule: any[], key: string | undefined) => {
        const matchers = rule.map((line) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          return buildFilter(line)
        })
        return createMatcher(logical[operator](matchers), fieldSelector(key))
      },
    ),
  ],
  [
    T,
    composeArgs(
      cond([
        [
          ruleIsSimple,
          makeMatcher(
            (operator: LogicalOperands, rule: any, key: string | undefined) =>
              createMatcher(
                logical[operator](
                  createMatcher(operators.$eq(rule), fieldSelector(undefined)),
                ),
                fieldSelector(key),
              ),
          ),
        ],
        [
          T,
          makeMatcher(
            (operator: LogicalOperands, rule: any, key: string | undefined) =>
              createMatcher(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                logical[operator](buildFilter(rule)),
                fieldSelector(key),
              ),
          ),
        ],
      ]),
    ),
  ],
])
