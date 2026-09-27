<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('database seeder creates the admin account', function () {
    $this->seed();

    $admin = User::where('email', 'bo3bdo@hotmail.com')->firstOrFail();

    expect($admin->name)->toBe('Admin')
        ->and(Hash::check('password', $admin->password))->toBeTrue()
        ->and(User::where('email', 'bo3bdo@hotmail.com')->count())->toBe(1);
});
