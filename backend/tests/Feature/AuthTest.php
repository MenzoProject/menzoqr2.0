<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_register_and_receive_a_token(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Ivan Petrov',
            'email' => 'ivan@example.com',
            'phone' => '+79990000000',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertCreated();
        $response->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);

        $this->assertDatabaseHas('users', ['email' => 'ivan@example.com']);
    }

    public function test_a_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'owner@example.com',
            'password' => bcrypt('Password123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'owner@example.com',
            'password' => 'Password123',
        ]);

        $response->assertOk();
        $response->assertJsonPath('user.id', $user->id);
    }

    public function test_login_fails_with_incorrect_password(): void
    {
        User::factory()->create([
            'email' => 'owner@example.com',
            'password' => bcrypt('Password123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'owner@example.com',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(401);
    }
}
