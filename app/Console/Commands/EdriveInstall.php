<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class EdriveInstall extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edriveInstall';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Edrive installation';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('===============================================================');
        $this->call('db:wipe');
        $this->info('[Let\'s start process all migrations:]');
        $this->call('migrate');

        $this->info('===============================================================');
        $this->info('[Let\'s start process all seeders:]');
        $this->call('db:seed');

        $this->info('===============================================================');
        $this->info('[Let\'s start process generating unique key:]');
        $this->call('key:generate');

        $this->info('Everything looks perfect! Now you can start use edrive!');
        $this->info('===============================================================');

        $this->call('optimize:clear');
    }
}
