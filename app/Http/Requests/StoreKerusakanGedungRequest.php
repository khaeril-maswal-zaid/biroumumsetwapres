<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKerusakanGedungRequest extends FormRequest
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
            'location'    => 'required|string|max:255',
            'damageType'  => 'required|string|max:255',
            'kategori'    => 'required|string|exists:kategori_kerusakans,kode_kerusakan',
            'description' => 'required|string|max:255',
            'photos'      => 'required|array',
            'photos.*'    => 'image|mimes:jpeg,png,jpg,heic|max:5125',
            // 'urgency'     => 'required|in:rendah,sedang,tinggi',
            'contact'     => 'required|string|max:15',
        ];
    }

    public function messages(): array
    {
        return [
            'location.required'    => 'Lokasi kerusakan wajib diisi.',
            'damageType.required'  => 'Jenis kerusakan wajib diisi.',
            'kategori.required'    => 'Kategori kerusakan wajib diisi.',
            'kategori.exists'      => 'Kategori kerusakan tidak valid.',
            'description.required' => 'Deskripsi kerusakan wajib diisi.',

            'photos.required'      => 'Foto kerusakan wajib diunggah.',
            'photos.array'         => 'Format foto harus berupa array.',
            'photos.*.image'       => 'Setiap file harus berupa gambar yang valid.',
            'photos.*.mimes'       => 'Format gambar harus jpg, jpeg, png, atau heic.',
            'photos.*.max'         => 'Ukuran gambar maksimal 5MB.',
            // 'urgency.required'   => 'Tingkat urgensi wajib diisi.',
            'contact.required'     => 'Nomor kontak wajib diisi.',
            'contact.max'          => 'Nomor kontak maksimal 15 karakter.',
        ];
    }
}
