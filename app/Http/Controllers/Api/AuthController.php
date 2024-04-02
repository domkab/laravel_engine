<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function signup(SignupRequest $request): JsonResponse
    {
        $data = $request->validated();
        /** @var \App\Models\User $user */

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $device = $request->headers->get('User-Agent', 'default-value');
        $token = $user->createToken($device)->plainTextToken;
        // user agent device name duok acess tokena per device pavadinima

        return response()->json([
            'user' => $user,
            'token' => $token,
            'device' => $device,
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Provided email address or password is incorrect'
            ], 422);
        }
        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request) //: JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'=> 'success'
        ]);
    }
}

// atsiskirti pilnai concerns
// atskiri git repos.

// token expiration funkcionalumas
/** @var User $user */
