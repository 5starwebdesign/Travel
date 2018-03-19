<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	// DB::table('users')->insert([
     //    	'username' => 'admin',
     //    	'password' => bcrypt('admin'),
     //    	'user_type' => 0
     //    ]);
        DB::table('trips')->insert([
        	'user_id' => 3,
        	'destination' => 'Madrid',
        	'start_date' => '2016-12-05',
        	'end_date'	=> '2016-12-15',
        	'comment' => 'test2'
        ]);
    }
}
