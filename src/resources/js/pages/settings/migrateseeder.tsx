import { type BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';

import HeadingSmall from '@/components/heading-small';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Head } from '@inertiajs/react';

import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Developer mode',
        href: '/settings/developer-only',
    },
];

export default function Profile() {
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<Required<{ password: string; confirm: string }>>({
        password: '',
        confirm: '',
    });

    const migrstedSeeded: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('developeronly.migrate'), {
            preserveScroll: true,
            onSuccess: ({ flash }) => {
                closeModal();
                console.log(flash);
            },
            onError: (e) => {
                console.log(e);
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Migrate Seeder" description="Run database migrations and seeders" />

                    <div className="space-y-6">
                        <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                            <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                                <p className="font-medium">Warning</p>
                                <p className="text-sm">Please proceed with caution, this cannot be undone.</p>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive">Migrate & Seed App</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Are you sure you want to Migrate & Seed App?</DialogTitle>
                                    <DialogDescription>
                                        Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter
                                        your password to confirm you would like to permanently Migrate & Seed App.
                                    </DialogDescription>
                                    <form className="space-y-6" onSubmit={migrstedSeeded}>
                                        <Input
                                            name="confirm"
                                            placeholder="Type RESET_DATABASE"
                                            value={data.confirm}
                                            onChange={(e) => setData('confirm', e.target.value)}
                                        />

                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="Password"
                                            className="mb-1"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <InputError message={errors.password} />

                                        <DialogFooter className="gap-2">
                                            <DialogClose asChild>
                                                <Button variant="secondary" onClick={closeModal}>
                                                    Cancel
                                                </Button>
                                            </DialogClose>

                                            <Button variant="destructive" disabled={processing} asChild>
                                                <button type="submit">Migrate & Seed App</button>
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
