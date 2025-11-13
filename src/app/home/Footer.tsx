import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: FC = () => (
  <footer className="hidden lg:block bg-gray-100 py-6">
    <div className="container mx-auto px-4 text-center text-gray-600">
      <div className="flex justify-center mb-4">
        <Link href="/">
          <Image
            src="/web.png"
            alt="Storevia Logo"
            width={120}
            height={40}
            className="object-contain cursor-pointer"
          />
        </Link>
      </div>
      <p>© 2025 Storevia Premium Store Network. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;