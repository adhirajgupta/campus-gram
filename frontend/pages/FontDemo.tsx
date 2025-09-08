import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { Font, Header, Subheader, Body, Accent, Button, Small, Display } from '../components/Font';
import { useFonts } from '../hooks/useFonts';
import { ArrowLeft } from 'lucide-react';

export default function FontDemo() {
  const navigate = useNavigate();
  const fonts = useFonts();

  return (
    <div className="min-h-screen bg-white">
      <TopNavbar />
      <div className="min-h-screen pt-16">
        <div className="px-6 py-8 pb-24">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/feed')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              style={{ transform: 'rotate(-0.2deg)' }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>back to feed</span>
            </button>
          </div>

          {/* Demo Content */}
          <div className="space-y-8">
            {/* Font System Overview */}
            <div className="border-2 border-gray-400 rounded-lg p-6" style={{
              transform: 'rotate(0.2deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
            }}>
              <Header>Font System Demo</Header>
              <Body className="mt-4">
                This page demonstrates the new font system with Patrick Hand and Gloria Hallelujah fonts.
              </Body>
            </div>

            {/* Font Variants */}
            <div className="border-2 border-gray-400 rounded-lg p-6" style={{
              transform: 'rotate(-0.1deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
            }}>
              <Subheader>Font Variants</Subheader>
              
              <div className="mt-4 space-y-4">
                <div>
                  <Small>Primary Font (Patrick Hand):</Small>
                  <Font variant="PRIMARY" className="block mt-1 text-lg">
                    This is Patrick Hand font - perfect for main content
                  </Font>
                </div>
                
                <div>
                  <Small>Secondary Font (Gloria Hallelujah):</Small>
                  <Font variant="SECONDARY" className="block mt-1 text-lg">
                    This is Gloria Hallelujah font - great for accents
                  </Font>
                </div>
                
                <div>
                  <Small>Legacy Font (MTF Jude):</Small>
                  <Font variant="LEGACY" className="block mt-1 text-lg">
                    This is MTF Jude font - keeping for compatibility
                  </Font>
                </div>
              </div>
            </div>

            {/* Font Presets */}
            <div className="border-2 border-gray-400 rounded-lg p-6" style={{
              transform: 'rotate(0.1deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
            }}>
              <Subheader>Font Presets</Subheader>
              
              <div className="mt-4 space-y-4">
                <div>
                  <Display>Display Text</Display>
                  <Small>Large display text using Gloria Hallelujah</Small>
                </div>
                
                <div>
                  <Header>Header Text</Header>
                  <Small>Main headers using Patrick Hand</Small>
                </div>
                
                <div>
                  <Subheader>Subheader Text</Subheader>
                  <Small>Subheaders using Patrick Hand</Small>
                </div>
                
                <div>
                  <Body>Body text for regular content</Body>
                  <Small>Main body text using Patrick Hand</Small>
                </div>
                
                <div>
                  <Accent>Accent text for special elements</Accent>
                  <Small>Special accent text using Gloria Hallelujah</Small>
                </div>
                
                <div>
                  <Button>Button Text</Button>
                  <Small>Button text using Patrick Hand</Small>
                </div>
                
                <div>
                  <Small>Small text for captions and details</Small>
                  <Small>Small text using Patrick Hand</Small>
                </div>
              </div>
            </div>

            {/* Usage Examples */}
            <div className="border-2 border-gray-400 rounded-lg p-6" style={{
              transform: 'rotate(-0.2deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
            }}>
              <Subheader>Usage Examples</Subheader>
              
              <div className="mt-4 space-y-4">
                <div>
                  <Small>Using the Font component:</Small>
                  <div className="mt-2 p-3 bg-gray-50 rounded border">
                    <code className="text-sm">
                      {`<Font variant="PRIMARY" size="LG" weight="BOLD">Hello World</Font>`}
                    </code>
                  </div>
                </div>
                
                <div>
                  <Small>Using preset components:</Small>
                  <div className="mt-2 p-3 bg-gray-50 rounded border">
                    <code className="text-sm">
                      {`<Header>My Title</Header>`}
                      <br />
                      {`<Body>My content</Body>`}
                      <br />
                      {`<Accent>Special text</Accent>`}
                    </code>
                  </div>
                </div>
                
                <div>
                  <Small>Using the useFonts hook:</Small>
                  <div className="mt-2 p-3 bg-gray-50 rounded border">
                    <code className="text-sm">
                      {`const fonts = useFonts();`}
                      <br />
                      {`<div style={fonts.primary}>Content</div>`}
                    </code>
                  </div>
                </div>
                
                <div>
                  <Small>Using CSS classes:</Small>
                  <div className="mt-2 p-3 bg-gray-50 rounded border">
                    <code className="text-sm">
                      {`<div className="font-primary">Content</div>`}
                      <br />
                      {`<div className="font-secondary">Accent</div>`}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Examples */}
            <div className="border-2 border-gray-400 rounded-lg p-6" style={{
              transform: 'rotate(0.1deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
            }}>
              <Subheader>Live Examples</Subheader>
              
              <div className="mt-4 space-y-4">
                <div className="p-4 border border-gray-300 rounded-lg">
                  <Header>Welcome to Campus Gram!</Header>
                  <Body className="mt-2">
                    This is a sample post using our new font system. The primary font (Patrick Hand) 
                    is used for most content, while the secondary font (Gloria Hallelujah) is perfect 
                    for special accents and highlights.
                  </Body>
                  <Accent className="mt-2 block">
                    ✨ This is an accent message using Gloria Hallelujah!
                  </Accent>
                  <Small className="mt-2 block text-gray-500">
                    Posted 2 hours ago • 15 likes • 3 comments
                  </Small>
                </div>
                
                <div className="p-4 border border-gray-300 rounded-lg">
                  <Subheader>Study Group: Computer Science 101</Subheader>
                  <Body className="mt-2">
                    Join our study group for CS 101! We meet every Tuesday and Thursday 
                    in the library. All skill levels welcome.
                  </Body>
                  <Button className="mt-3 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Join Group
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
