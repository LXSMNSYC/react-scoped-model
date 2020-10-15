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
  addSWRValueListener,
  createSWRValue,
  setSWRValue,
  SWRValue,
  SWRValueListener,
} from './swr-value';

export type SWRMap<T> = Map<string, SWRValue<T>>;

export function createSWRMap<T>(): SWRMap<T> {
  return new Map<string, SWRValue<T>>();
}

export function getSWRMapRef<T>(
  map: SWRMap<T>,
  key: string,
  value: T,
): SWRValue<T> {
  const ref = map.get(key);

  if (ref) {
    return ref;
  }

  const newRef = createSWRValue(value);
  map.set(key, newRef);

  return newRef;
}

export function addSWRMapListener<T>(
  map: SWRMap<T>,
  key: string,
  listener: SWRValueListener<T>,
): void {
  const ref = map.get(key);

  if (ref) {
    addSWRValueListener(ref, listener);
  }
}

export function removeSWRMapListener<T>(
  map: SWRMap<T>,
  key: string,
  listener: SWRValueListener<T>,
): void {
  const ref = map.get(key);

  if (ref) {
    addSWRValueListener(ref, listener);
  }
}

export function setSWRMap<T>(
  map: SWRMap<T>,
  key: string,
  value: T,
  notify = true,
): void {
  const ref = getSWRMapRef(map, key, value);

  setSWRValue(ref, value, notify);
}

export function getSWRMap<T>(
  map: SWRMap<T>,
  key: string,
): T | undefined {
  return map.get(key)?.value;
}
