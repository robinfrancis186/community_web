import React, { useState, useEffect } from 'react';
import { Camera, Loader, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const AvatarUpload = ({ url, onUpload, size = 150 }) => {
    const { user } = useAuth();
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (url) {
            if (url.startsWith('http')) {
                setAvatarUrl(url);
            } else {
                downloadImage(url);
            }
        }
    }, [url]);

    const downloadImage = async (path) => {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error) {
            console.log('Error downloading image: ', error.message);
        }
    };

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            onUpload(filePath);
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative group" style={{ width: size, height: size }}>
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg bg-slate-100 dark:bg-slate-800">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User size={size * 0.5} />
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader className="animate-spin text-white" size={24} />
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 right-0">
                <label
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white cursor-pointer shadow-lg hover:bg-primary-600 transition-colors"
                    htmlFor="single"
                >
                    <Camera size={18} />
                </label>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    );
};

export default AvatarUpload;
