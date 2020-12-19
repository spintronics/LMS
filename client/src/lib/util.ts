import { assocPath, curry, pathOr } from 'ramda';

export const $path = function $path(path: string[] | string) {
  return typeof path === 'string' ? path.split('.') : path;
};

export const $getOr = curry(function $get(
  def: any,
  path: string[] | string,
  target: object
) {
  return pathOr(def, $path(path), target);
});

export const $get = $getOr(null);

export const $assocPath = curry(
  (path: string[] | string, value: any, target: object) =>
    assocPath($path(path), value, target)
);
