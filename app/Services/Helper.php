<?php


namespace App\Services;


use Illuminate\Database\Eloquent\Model;

class Helper
{
    /**
     * String is for example for cache name
     * @param array $args
     * @return string
     */
    public function prepareName(array $args, string $prefix = 'site'): string
    {
        $params = $this->prepare($args, $prefix) ?? [];

        return implode('.', $params);
    }

    private function prepare(array $args, string $prefix)
    {
        $params = [$prefix];

        foreach ($args as $key => $arg) {
            if (!$arg) continue;

            if (is_string($arg) || is_numeric($arg)) {

                $params[] = trim($arg);

            } elseif ($arg instanceof Model && $arg->exists) {

                $params[] = $arg->alias;

            } elseif (is_array($arg)) {

                if (!isset($arg['from']) && !isset($item['to'])) {
                    $params = collect($params)->merge($this->prepare($arg, $prefix))->unique()->toArray();
                }
                if (isset($arg['from'])) {
                    $params[] = $key . '.from'. $arg['from'];
                }
                if (isset($arg['to'])) {
                    $params[] = $key . '.to'. $arg['to'];
                }
            }
        }

        return $params;
    }
}