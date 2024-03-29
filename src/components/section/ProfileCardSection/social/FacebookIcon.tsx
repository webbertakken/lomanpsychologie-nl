import Tooltip from '@tippyjs/react';

interface Props {
  handle: string;
}

const FacebookIcon = ({ handle: dirtyHandle }: Props): JSX.Element => {
  const handle = dirtyHandle.replace(/^(@)/, '');
  return (
    <Tooltip content={`@${handle}`}>
      <a className="link" target="_blank" rel="noreferrer" href={`https://facebook.com/${handle}`}>
        <svg
          className="h-6 fill-current text-gray-600 hover:text-emerald-800"
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Facebook</title>
          <path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0" />
        </svg>
      </a>
    </Tooltip>
  );
};

export default FacebookIcon;
