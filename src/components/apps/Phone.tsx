import { Phone as PhoneIcon, Mail, Linkedin, Github } from 'lucide-react';

export function Phone() {
  const contactInfo = {
    email: "adityaperswal@gmail.com",
    phone: "+91 9999999999", // Replace with your actual phone number
    linkedin: "https://www.linkedin.com/in/aditya-perswal/",
    github: "https://github.com/adityaperswal"
  };

  return (
    <div className="h-full bg-gray-900 flex items-center justify-center p-8">
      {/* Phone Device Frame */}
      <div className="w-[300px] h-[600px] bg-black rounded-[3rem] p-4 relative shadow-2xl border-4 border-gray-800">
        {/* Phone Screen */}
        <div className="h-full w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] overflow-hidden relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-2xl" />
          
          {/* Content */}
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8">
            <div className="animate-bounce">
              <PhoneIcon className="w-16 h-16 text-green-400" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">
                Let's Connect!
              </h1>
              <p className="text-gray-400">
                Ready to create something innovative?
              </p>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-4 w-full max-w-xs">
              <a 
                href={`tel:${contactInfo.phone}`}
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-full font-medium transition-colors"
              >
                <PhoneIcon size={18} />
                Call Now
              </a>
              
              <a 
                href={`mailto:${contactInfo.email}`}
                className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-full font-medium transition-colors"
              >
                <Mail size={18} />
                Email Me
              </a>

              <div className="flex justify-center gap-4 pt-4">
                <a 
                  href={contactInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Linkedin size={20} className="text-blue-400" />
                </a>
                <a 
                  href={contactInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Github size={20} className="text-white" />
                </a>
              </div>
            </div>

            {/* iPhone-style home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
} 