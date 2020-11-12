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
import { useRef, useState } from 'react';
import useConstantCallback from './useConstantCallback';
import useIsomorphicEffect from './useIsomorphicEffect';

export type Compare<T> = (a: T, b: T) => boolean;
export type Enqueue<T> = (node: T, compare?: Compare<T>) => void;
export type QueueReset = () => void;

function defer(cb: () => void, catchError: (error: any) => void): void {
  Promise.resolve(true).then(cb, catchError);
}

export default function useWorkQueue<T>(): [T[], Enqueue<T>, QueueReset] {
  const [state, setState] = useState<T[]>([]);
  const [error, setError] = useState<Error | undefined>();

  const lifecycle = useRef(false);

  useIsomorphicEffect(() => {
    lifecycle.current = true;
    return () => {
      lifecycle.current = false;
    };
  }, []);

  const schedule = useConstantCallback((node: T, compare?: Compare<T>) => {
    defer(() => {
      if (lifecycle.current) {
        setState((current) => {
          const queue = compare
            ? current.filter((value) => compare(node, value))
            : current;
          return [...queue, node];
        });
      }
    }, setError);
  });

  const reset = useConstantCallback(() => {
    defer(() => {
      if (lifecycle.current) {
        setState([]);
      }
    }, setError);
  });

  if (error) {
    throw error;
  }

  return [state, schedule, reset];
}
