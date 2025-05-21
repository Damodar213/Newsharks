import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User, { UserRole } from '@/lib/models/User';
import Pitch, { PitchStatus } from '@/lib/models/Pitch';
import Message from '@/lib/models/Message';
import Offer, { OfferStatus } from '@/lib/models/Offer';

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Clear existing data (optional, comment out if you want to keep existing data)
    await User.deleteMany({});
    await Pitch.deleteMany({});
    await Message.deleteMany({});
    await Offer.deleteMany({});
    
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@newsharks.com',
      password: 'password123',
      role: UserRole.ADMIN,
      bio: 'System administrator',
    });
    
    // Create investor user
    const investor = await User.create({
      name: 'John Investor',
      email: 'investor@example.com',
      password: 'password123',
      role: UserRole.INVESTOR,
      bio: 'Angel investor with 10 years of experience in tech startups',
    });
    
    // Create entrepreneur user
    const entrepreneur = await User.create({
      name: 'Sarah Entrepreneur',
      email: 'entrepreneur@example.com',
      password: 'password123',
      role: UserRole.ENTREPRENEUR,
      bio: 'Serial entrepreneur with passion for innovation',
    });
    
    // Create pitch
    const pitch = await Pitch.create({
      entrepreneur: entrepreneur._id,
      title: 'EcoTech - Sustainable Energy Solution',
      businessDescription: 'Revolutionary solar technology that increases efficiency by 40%',
      askAmount: 500000,
      equity: 15,
      valuation: 3000000,
      status: PitchStatus.SUBMITTED,
      industry: 'Clean Energy',
      targetMarket: 'Residential and Commercial',
      currentRevenue: 50000,
      projectedRevenue: 2000000,
      teamSize: 5,
    });
    
    // Create message
    await Message.create({
      sender: investor._id,
      receiver: entrepreneur._id,
      content: 'I\'m interested in your EcoTech pitch. Can we schedule a call?',
      read: false,
      relatedPitch: pitch._id,
    });
    
    // Create offer
    const oneWeekLater = new Date();
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    
    await Offer.create({
      investor: investor._id,
      pitch: pitch._id,
      amount: 400000,
      equity: 12,
      termsAndConditions: 'Investment to be made in two installments. Seeking board seat.',
      status: OfferStatus.PENDING,
      expiresAt: oneWeekLater,
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully',
      data: {
        users: await User.countDocuments(),
        pitches: await Pitch.countDocuments(),
        messages: await Message.countDocuments(),
        offers: await Offer.countDocuments(),
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 