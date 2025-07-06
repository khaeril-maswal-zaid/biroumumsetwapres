<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePermintaanAtkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items'        => 'nullable|array',
            'justification' => 'required|string|max:255',
            'urgency'      => 'required|in:normal,mendesak,segera',
            'contact'      => 'required|string|max:15',
        ];
    }

    public function messages(): array
    {
        return [
            'items.array'         => 'Daftar kebutuhan harus berupa array.',
            'justification.required' => 'Deskripsi kebutuhan wajib diisi.',
            'urgency.required'    => 'Tingkat urgensi wajib diisi.',
            'urgency.in'          => 'Tingkat urgensi tidak valid.',
            'contact.required'    => 'Nomor kontak wajib diisi.',
            'contact.max'         => 'Nomor kontak maksimal 15 karakter.',
        ];
    }
}
