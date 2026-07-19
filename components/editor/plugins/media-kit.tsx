'use client';

import { CaptionPlugin } from '@platejs/caption/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  VideoPlugin,
} from '@platejs/media/react';
import { KEYS } from 'platejs';

import { AudioElement } from '@/components/ui/media-audio-node';
import { FileElement } from '@/components/ui/media-file-node';
import { ImageElement } from '@/components/ui/media-image-node';
import { MediaPreviewDialog } from '@/components/ui/media-preview-dialog';
import { VideoElement } from '@/components/ui/media-video-node';

export const MediaKit = [
  ImagePlugin.configure({
    options: { disableUploadInsert: true },
    render: { afterEditable: MediaPreviewDialog, node: ImageElement },
  }),
  VideoPlugin.configure({
    options: { disableUploadInsert: true },
    render: { node: VideoElement },
  }),
  AudioPlugin.configure({
    options: { disableUploadInsert: true },
    render: { node: AudioElement },
  }),
  FilePlugin.configure({
    options: { disableUploadInsert: true },
    render: { node: FileElement },
  }),
  CaptionPlugin.configure({
    options: {
      query: {
        allow: [KEYS.img, KEYS.video, KEYS.audio, KEYS.file],
      },
    },
  }),
];
