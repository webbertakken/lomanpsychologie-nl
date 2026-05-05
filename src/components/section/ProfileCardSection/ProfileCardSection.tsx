import cx from 'classnames'
import Image from 'next/image'
import { ProfileSectionEntry } from '../../../types/section'
import FadeIntoView from '../../animations/fade-into-view'
import Bio from './fields/Bio'
import GetInTouchButton from './fields/GetInTouchButton'
import Location from './fields/Location'
import Vocation from './fields/Vocation'
import FacebookIcon from './social/FacebookIcon'
import InstagramIcon from './social/InstagramIcon'
import LinkedInIcon from './social/LinkedInIcon'
import TwitterIcon from './social/TwitterIcon'
import YoutubeIcon from './social/YoutubeIcon'

interface Props {
  section: ProfileSectionEntry
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
  } = section.fields

  const image = {
    src: `https:${photo.fields.file.url}`,
    width: photo.fields.file.details.image.width,
    height: photo.fields.file.details.image.height,
  }

  const Photo = () => (
    <div className="w-full lg:w-2/5 hidden lg:block">
      <Image className="rounded-none lg:rounded-lg shadow-2xl" alt={title} {...image} />
    </div>
  )

  return (
    <div
      id={slug}
      className="w-full h-auto lg:h-screen py-12 first:pt-36 first:-mt-24 flex items-center justify-center"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1446057468532-87b7525217d6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3902&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
      }}
    >
      <div className="max-w-3xl flex items-center h-auto flex-wrap mx-auto my-12 lg:my-0">
        {photoShouldBeOnTheLeft && <Photo />}
        <div
          className={cx('w-full lg:w-3/5 shadow-2xl bg-white opacity-75 mx-4 lg:mx-0', {
            'rounded-lg': true,
            'lg:rounded-l-lg': !photoShouldBeOnTheLeft,
            'lg:rounded-r-none': !photoShouldBeOnTheLeft,
            'lg:rounded-r-lg': photoShouldBeOnTheLeft,
            'lg:rounded-l-none': photoShouldBeOnTheLeft,
          })}
        >
          <div className="p-4 lg:p-12 text-center lg:text-left">
            <div
              className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-top"
              style={{ backgroundImage: `url('${image.src}')` }}
            />

            <FadeIntoView delay={100}>
              <h1 className="text-3xl font-bold pt-8 lg:pt-0">{title}</h1>
              <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-emerald-500 opacity-25" />
            </FadeIntoView>

            <FadeIntoView delay={200}>
              <Vocation vocation={vocation} />
            </FadeIntoView>

            <FadeIntoView delay={250}>
              <Location location={location} />
            </FadeIntoView>

            <FadeIntoView delay={300}>
              <Bio shortDescription={shortDescription} />
            </FadeIntoView>

            {getInTouchLink && (
              <FadeIntoView delay={500}>
                <GetInTouchButton text={getInTouchText} link={getInTouchLink} />
              </FadeIntoView>
            )}

            <FadeIntoView delay={700}>
              <div className="mt-6 pb-16 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-center justify-between">
                {/* Use https://simpleicons.org/ to find the svg for your preferred product */}
                {twitterHandle && <TwitterIcon handle={twitterHandle} />}
                {facebookHandle && <FacebookIcon handle={facebookHandle} />}
                {instagramHandle && <InstagramIcon handle={instagramHandle} />}
                {youtubeHandle && <YoutubeIcon handle={youtubeHandle} />}
                {linkedInHandle && <LinkedInIcon handle={linkedInHandle} />}
              </div>
            </FadeIntoView>
          </div>
        </div>

        {!photoShouldBeOnTheLeft && <Photo />}
      </div>
    </div>
  )
}

export default ProfileCardSection
