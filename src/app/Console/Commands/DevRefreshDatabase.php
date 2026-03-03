<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DevRefreshDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:dev-refresh-database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh database (migrate:fresh + seed) for dev environment';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Tulis log di output
        $this->info('Running migrate:fresh with seed...');

        // Panggil migrate:fresh
        $this->call('migrate:fresh', ['--seed' => true]);

        $this->info('Done!');
    }
}
