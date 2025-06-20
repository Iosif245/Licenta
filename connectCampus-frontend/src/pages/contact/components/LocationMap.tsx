import React from 'react';

const LocationMap = () => {
  return (
    <div className="rounded-lg overflow-hidden h-[400px] border">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2712.155!2d27.5664964!3d47.1574076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40cafbde6a1799ff%3A0x9434af7007f4c92e!2sPalas%20Campus!5e0!3m2!1sen!2sro!4v1718108234561!5m2!1sen!2sro&markers=color:red%7Clabel:C%7C47.1574076,27.5664964"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Campus Connect Location at Palas Campus, Iași"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default LocationMap;
