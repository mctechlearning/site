
import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';

export async function GET() {
  const langflowUrl = cookies().get('langflowUrl')?.value;
  if (langflowUrl) {
    return NextResponse.json({langflowUrl});
  }
  return NextResponse.json({langflowUrl: ''});
}

export async function POST(req: NextRequest) {
  const {langflowUrl} = await req.json();
  if (langflowUrl) {
    cookies().set('langflowUrl', langflowUrl);
    return NextResponse.json({success: true});
  }
  return NextResponse.json({success: false, error: 'No URL provided'}, {status: 400});
}
