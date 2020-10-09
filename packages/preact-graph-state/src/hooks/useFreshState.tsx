/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2020
 */
import {
  Ref, useRef,
} from 'preact/hooks';
import useCallbackCondition from './useCallbackCondition';
import useForceUpdate from './useForceUpdate';
import useIsomorphicEffect from './useIsomorphicEffect';
import useMemoCondition, { defaultCompare, MemoCompare } from './useMemoCondition';

export type RefreshStateInitialAction<T> = () => T;
export type RefreshStateInitial<T> = T | RefreshStateInitialAction<T>;

function isRefreshStateInitialAction<T>(
  initial: RefreshStateInitial<T>,
): initial is RefreshStateInitialAction<T> {
  return typeof initial === 'function';
}

export type RefreshStateAction<T> = (prev: T) => T;
export type RefreshStateSetState<T> = T | RefreshStateAction<T>;
export type RefreshStateDispatch<T> = (action: RefreshStateSetState<T>) => void;

function isRefreshStateAction<T>(
  state: RefreshStateSetState<T>,
): state is RefreshStateAction<T> {
  return typeof state === 'function';
}

export default function useFreshState<T, R>(
  initialState: RefreshStateInitial<T>,
  dependencies: R,
  shouldUpdate: MemoCompare<R> = defaultCompare,
): [T, RefreshStateDispatch<T>] {
  const stateRef = useMemoCondition<Ref<T>, R>(
    () => ({
      current: (
        isRefreshStateInitialAction(initialState)
          ? initialState()
          : initialState
      ),
    }),
    dependencies,
    shouldUpdate,
  );

  const forceUpdate = useForceUpdate();

  const alive = useRef(false);

  useIsomorphicEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const setState: RefreshStateDispatch<T> = useCallbackCondition(
    (action) => {
      if (alive.current) {
        const { current } = stateRef;
        const newState = (
          isRefreshStateAction(action)
            ? action(current)
            : action
        );

        if (!Object.is(current, newState)) {
          stateRef.current = newState;
          forceUpdate();
        }
      }
    },
    [forceUpdate, stateRef],
    (prev, next) => (
      !Object.is(prev[0], next[0]) || !Object.is(prev[1], next[1])
    ),
  );

  return [stateRef.current, setState];
}
