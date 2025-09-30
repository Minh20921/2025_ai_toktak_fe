'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const FullLogo = () => {
  return (
    <Link href={'/'}>
      {/* Dark Logo   */}
      {/*<Image src={'/logos/dark-logo.svg'} alt="logo" layout={"fill"} className="block dark:hidden rtl:scale-x-[-1]" />*/}
      {/* Light Logo  */}
      {/*<Image src={'images/logos/light-logo.svg'} alt="logo" className="hidden dark:block rtl:scale-x-[-1]" />*/}
    </Link>
  );
};

export default FullLogo;
