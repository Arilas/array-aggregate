import { createMatcher } from '../createMatcher'
import { fieldSelector } from '../fieldSelector'
import logical, { LogicalOperands } from '../logical'
import operators from '../operators'
import { cond, T } from '../../utils/cond'
import { composeArgs } from '../../utils/composeArgs'
import { ruleIsArray, ruleIsSimple } from '../utils/checks'
import { makeDevMatcher, makeMatcher } from '../utils/makeMatcher'
import { buildFilter, buildFilterDev } from '../buildFilter'
import { Schema, SchemaPart, setInSchema } from '../utils/Schema'

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
                logical[operator](buildFilter(rule)),
                fieldSelector(key),
              ),
          ),
        ],
      ]),
    ),
  ],
])
