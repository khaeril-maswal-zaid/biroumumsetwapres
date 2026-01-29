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
    // public function rules(): array
    // {
    //     return [
    //         'location'    => 'required|string|max:255',
    //         'damageType'  => 'required|string|max:255',
    //         'kategori'    => 'required|string|exists:kategori_kerusakans,kode_kerusakan',
    //         'description' => 'required|string|max:255',
    //         'photos'      => 'required|array',
    //         'photos.*'    => 'image|mimes:jpeg,png,jpg,heic,mp4,mov,avi,mkv,webm|max:5125',
    //         // 'urgency'     => 'required|in:rendah,sedang,tinggi',
    //         'contact'     => 'required|string|max:15',
    //     ];
    // }

    public function rules(): array
    {
        return [
            'location'    => 'required|string|max:255',
            'damageType'  => 'required|string|max:255',
            'kategori'    => 'required|string|exists:kategori_kerusakans,kode_kerusakan',
            'description' => 'required|string|max:255',
            'photos'      => 'required|array',
            'photos.*'    => [
                'required',
                'file',
                'mimes:jpeg,png,jpg,heic,mp4,mov,avi,mkv,webm',
                function ($attribute, $value, $fail) {
                    // ukuran dalam byte
                    $sizeInMB = $value->getSize() / 1024 / 1024;
                    $mime     = $value->getMimeType();

                    if (str_starts_with($mime, 'video/')) {
                        if ($sizeInMB > 20) {
                            $fail('Ukuran video maksimal 20 MB.');
                        }
                    } else {
                        if ($sizeInMB > 5) {
                            $fail('Ukuran foto maksimal 5 MB.');
                        }
                    }
                },
            ],
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

            'photos.required'      => 'Dokumentasi kerusakan wajib diunggah.',
            'photos.array'         => 'Dokumentasi harus berupa daftar file.',
            'photos.*.required'    => 'Setiap file dokumentasi wajib diunggah.',
            'photos.*.file'        => 'File dokumentasi tidak valid.',
            'photos.*.mimes'       => 'Format file harus berupa foto (jpg, jpeg, png, heic) atau video (mp4, mov, avi, mkv, webm).',

            // ⚠️ TIDAK perlu:
            // - photos.*.image
            // - photos.*.max

            'contact.required'     => 'Nomor kontak wajib diisi.',
            'contact.max'          => 'Nomor kontak maksimal 15 karakter.',
        ];
    }
}
