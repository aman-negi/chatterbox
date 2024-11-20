from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import os

tokenizer = AutoTokenizer.from_pretrained("knkarthick/MEETING_SUMMARY")
model = AutoModelForSeq2SeqLM.from_pretrained("knkarthick/MEETING_SUMMARY")

def store(data):
    with open("filestore/"+data["urlTitle"]+'.txt','a') as file:
        file.write(data["subtitle"] + " ")

def read(file_path):
    with open(file_path,'r') as file:
        content = file.read()
        return content

def summarize(data):
    file_path = "filestore/"+data["urlTitle"]+'.txt'
    # summarization logic
    print("Summarizing")
    if os.path.exists(file_path): 
        subtitle = read(file_path)
        inputs = tokenizer(subtitle, return_tensors="pt", max_length=1024, truncation=True, padding="longest")
        summary_ids = model.generate(inputs['input_ids'], max_length=150, min_length=30, length_penalty=2.0, num_beams=4, early_stopping=True)
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return "Summary : " + summary
    else: 
        return "NO Subtitle exists yet Start recording first"
    # return summarizer(subtitle)[0]['summary_text']

# # Example raw transcription (meeting transcription)
# transcription = """
# John:
# Good morning everyone! Let's get started. The first item on the agenda is the product launch. Sarah, could you update us on the timeline for the launch?

# Sarah:
# Sure! As per our plan, the product launch is set for December 15th. We're finalizing the last phase of testing, and the development team is working on fixing some of the minor bugs. The marketing team will begin the pre-launch campaign starting next week. We'll be sending out emails and teasers on social media.

# Emily:
# That's great to hear, Sarah. Have we finalized the marketing materials? I know we were waiting for some approvals from the design team.

# Sarah:
# Yes, we received the final designs yesterday. The marketing collateral is now ready. The product website is live, and we'll be sending out email templates by the end of this week. We’re also preparing a product demo video for the launch event.

# John:
# Excellent. Mark, what’s the current status of the budget for the product launch?

# Mark:
# We’re within budget, thankfully. There was a slight increase in costs due to the last-minute video production, but that was anticipated. We’ve allocated extra funds for influencer partnerships and targeted ads in the first month post-launch. Everything should be covered.

# Clara:
# Speaking of ads, are we targeting the right demographic? Have we identified the top regions and customer profiles for the campaign?

# Mark:
# Yes, Clara. Based on our market research, we're focusing on the US, UK, and Germany, with an age group of 25-40, tech-savvy professionals who prefer high-end products. We’ve also segmented our email lists to target early adopters and high-spenders.

# John:
# Sounds like everything is on track for the product launch. Next, let’s move on to the second agenda item: the marketing strategy. Emily, can you share the latest updates from the marketing team?

# Emily:
# Sure, John. We’ve finalized the social media strategy. The goal is to create a buzz before the launch by sharing sneak peeks of the product features and user testimonials. We’re planning to collaborate with influencers in the tech space to generate excitement and build anticipation. The strategy also includes a strong presence on LinkedIn, where we’ll be sharing thought leadership articles and customer success stories.

# Clara:
# Are we doing any paid campaigns as well? How will we ensure that our content reaches the right audience?

# Emily:
# Yes, we are. We’ve allocated a significant portion of the marketing budget for paid ads. Our focus will be on Facebook and Instagram ads, targeting users who have shown interest in similar products. We're also experimenting with Google Ads targeting specific search terms related to our product. This should help us drive traffic to the website.

# Sarah:
# Have we set up any tracking metrics for these campaigns? We need to ensure that we can measure the success of the campaign in real time.

# Emily:
# Absolutely. We’ve integrated Google Analytics and Facebook Insights for tracking. We’ll be monitoring the click-through rates, engagement, and conversions closely. Additionally, we’re running A/B tests on some of the ad creatives to see which resonates best with our audience.

# John:
# Great. It sounds like we have a solid plan. Lastly, let’s discuss the team retreat. Clara, can you give us an update on the location and plans?

# Clara:
# Of course. We’ve narrowed down the options to two potential locations: a mountain retreat in Colorado and a beachfront resort in Florida. The team is leaning toward the Colorado retreat because it offers more team-building activities and the environment is more focused on relaxation and focus, which could be beneficial after the product launch.

# Sarah:
# That sounds amazing! Have we finalized the dates yet?

# Clara:
# We’re looking at the second week of January, right after the holidays, when everyone should be back and ready to unwind. We’ll have a mix of group activities and free time for everyone to relax. The resort offers hiking, meditation sessions, and leadership workshops.

# Mark:
# I think Colorado would be great, especially with the team-building focus. The hiking and workshops will definitely help us reconnect and strategize for the next phase of the product lifecycle.

# John:
# I agree. Let's go with Colorado. Clara, please go ahead and finalize the bookings and share the details with the team.

# Clara:
# Will do, John. I’ll send out a survey to check the team’s preferences on the activities they’d like to participate in. We’ll finalize the itinerary soon.

# John:
# Perfect. That wraps up our meeting for today. To summarize, the product launch is on track for December 15th, the marketing team is ready to roll out the pre-launch campaign, and the team retreat is set for the second week of January at the Colorado retreat. Thanks everyone for your updates. Let’s keep pushing forward and make this launch a success!

# Sarah:
# Thanks, John. Looking forward to the launch!

# Clara:
# Excited about the retreat!

# Emily:
# Can’t wait to see everything come together.

# Mark:
# Let’s make it happen!

# John:
# Alright, see you all next week. Have a great day, everyone!
# """



