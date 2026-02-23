import { ASSET_AVATARS } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';

export type AuthUserProps = {
  email: string;
  name: string;
  profile_pic: string;
  handle: string;
  job_title: string;
};

export const FALLBACK_AUTH_USER: AuthUserProps = {
  email: '',
  name: 'User',
  profile_pic: getAssetPath(`${ASSET_AVATARS}/robot_1.png`, `60x60`),
  handle: '',
  job_title: '',
};
