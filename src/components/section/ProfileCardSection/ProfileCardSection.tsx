import FacebookIcon from './social/FacebookIcon';
import TwitterIcon from './social/TwitterIcon';
import YoutubeIcon from './social/YoutubeIcon';
import InstagramIcon from './social/InstagramIcon';
import Vocation from './fields/Vocation';
import Location from './fields/Location';
import Bio from './fields/Bio';
import GetInTouchButton from './fields/GetInTouchButton';
import LinkedInIcon from './social/LinkedInIcon';
import { ProfileSectionEntry } from '../../../types/section';
import FadeIntoView from '../../animations/fade-into-view';
import cx from 'classnames';
import Image from 'next/image';
import { CONTACT_DETAILS } from '../../../core/contact';

interface Props {
  section: ProfileSectionEntry;
}

const ProfileCardSection = ({ section }: Props): JSX.Element => {
  const {
    title,
    slug,
    photo,
    photoShouldBeOnTheLeft,
    vocation,
    location,
    shortDescription,
    getInTouchText,
    getInTouchLink,
    facebookHandle,
    instagramHandle,
    linkedInHandle,
    twitterHandle,
    youtubeHandle,
  } = section.fields;

  const image = {
    src: `https:${photo.fields.file.url}`,
    width: photo.fields.file.details.image.width,
    height: photo.fields.file.details.image.height,
  };

  const imageFigure = (
    <FadeIntoView>
      <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl bg-white/90 p-4 shadow-soft ring-1 ring-brand-denim/10">
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            alt={title}
            {...image}
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 80vw"
          />
        </div>
        <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/80 p-4 text-sm text-brand-denim shadow-lg">
          <p className="font-semibold">{vocation}</p>
          <p className="text-xs font-medium text-neutral-500">{location}</p>
        </div>
      </div>
    </FadeIntoView>
  );

  return (
    <section id={slug} className="relative w-full overflow-hidden bg-gradient-to-b from-brand-blush via-white to-brand-blush/60 py-24">
      <div className="absolute inset-x-0 -top-40 h-80 bg-brand-sky/40 blur-3xl" aria-hidden />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 px-6 md:px-10 lg:flex-row">
        <div
          className={cx('w-full lg:w-1/2', {
            'lg:order-1': photoShouldBeOnTheLeft,
            'lg:order-2': !photoShouldBeOnTheLeft,
          })}
        >
          {imageFigure}
        </div>
        <div
          className={cx('w-full lg:w-1/2', {
            'lg:order-2': photoShouldBeOnTheLeft,
            'lg:order-1': !photoShouldBeOnTheLeft,
          })}
        >
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <FadeIntoView>
              <div className="inline-flex items-center justify-center gap-2 self-center rounded-full bg-brand-sky/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-denim lg:self-start">
                Persoonlijk
              </div>
            </FadeIntoView>
            <FadeIntoView>
              <h1 className="text-4xl font-semibold leading-tight text-brand-ink sm:text-5xl">{title}</h1>
            </FadeIntoView>
            <FadeIntoView>
              <Vocation vocation={vocation} />
            </FadeIntoView>
            <FadeIntoView>
              <Location location={location} />
            </FadeIntoView>
            <FadeIntoView>
              <Bio shortDescription={shortDescription} />
            </FadeIntoView>

            <FadeIntoView>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-start">
                {getInTouchLink && <GetInTouchButton text={getInTouchText} link={getInTouchLink} />}
                <a href={CONTACT_DETAILS.email.href} className="button-secondary">
                  Mail {CONTACT_DETAILS.email.address}
                </a>
              </div>
            </FadeIntoView>

            <FadeIntoView>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-brand-denim lg:justify-start">
                {twitterHandle && <TwitterIcon handle={twitterHandle} />}
                {facebookHandle && <FacebookIcon handle={facebookHandle} />}
                {instagramHandle && <InstagramIcon handle={instagramHandle} />}
                {youtubeHandle && <YoutubeIcon handle={youtubeHandle} />}
                {linkedInHandle && <LinkedInIcon handle={linkedInHandle} />}
              </div>
            </FadeIntoView>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCardSection;
