export function TermsOfUseContent() {
  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="space-y-1">
        <p className="text-text-secondary">
          <strong>Effective date:</strong> 27 July 2026
        </p>
        <p className="text-text-secondary">
          <strong>Last updated:</strong> 27 July 2026
        </p>
      </div>

      <p className="text-text-secondary leading-relaxed">
        These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of
        the Qaliye mobile application, website at{" "}
        <a
          href="http://www.qaliye.com"
          className="text-primary hover:underline"
        >
          www.qaliye.com
        </a>
        , and any related features, content, products, subscriptions, and
        services that we provide together as the &ldquo;Services.&rdquo;
      </p>
      <p className="text-text-secondary leading-relaxed">
        Qaliye is operated by <strong>[YOUR FULL LEGAL NAME]</strong>, a sole
        trader trading as <strong>Qaliye</strong>, with a business address at{" "}
        <strong>[YOUR BUSINESS ADDRESS]</strong>.
      </p>
      <p className="text-text-secondary leading-relaxed">
        In these Terms, &ldquo;Qaliye,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
        and &ldquo;our&rdquo; refer to{" "}
        <strong>[YOUR FULL LEGAL NAME], trading as Qaliye</strong>.
      </p>
      <p className="text-text-secondary leading-relaxed">You can contact us at:</p>
      <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-1">
        <li>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:support@qaliye.com"
            className="text-primary hover:underline"
          >
            support@qaliye.com
          </a>
        </li>
        <li>
          <strong>Website:</strong>{" "}
          <a
            href="http://www.qaliye.com"
            className="text-primary hover:underline"
          >
            www.qaliye.com
          </a>
        </li>
        <li>
          <strong>Address:</strong> [YOUR BUSINESS ADDRESS]
        </li>
      </ul>
      <p className="text-text-secondary leading-relaxed">
        Please read these Terms carefully. By creating an account, accessing the
        Services, or selecting a button confirming your acceptance, you agree to
        be bound by these Terms, our{" "}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, our{" "}
        <a href="/community-guidelines" className="text-primary hover:underline">Community Guidelines</a>,
        and any additional terms presented to you for specific features or
        purchases.
      </p>
      <p className="text-text-secondary leading-relaxed">
        Do not use the Services if you do not agree with these Terms.
      </p>

      {/* Section 1 */}
      <Section number="1" title="About Qaliye">
        <p>
          Qaliye is a dating and relationship platform designed primarily for
          Habesha communities, including Ethiopian and Eritrean people and
          members of the global diaspora.
        </p>
        <p>
          Our purpose is to help adults build genuine connections while
          fostering respect for Habesha culture, values, traditions, languages,
          and communities.
        </p>
        <p>
          Qaliye welcomes respectful participation. Our cultural focus does not
          permit discrimination, harassment, hate speech, hostility, or abusive
          treatment based on ethnicity, nationality, religion, language, gender,
          disability, or any other protected characteristic.
        </p>
        <p>
          Qaliye does not guarantee that you will find a match, enter a
          relationship, marry, or achieve any particular outcome through the
          Services.
        </p>
      </Section>

      {/* Section 2 */}
      <Section number="2" title="Eligibility">
        <p>You may create an account and use Qaliye only if:</p>
        <List
          items={[
            "you are at least 18 years old;",
            "you have the legal capacity to enter into a binding agreement;",
            "you are not prohibited by applicable law from using the Services;",
            "you have not previously been permanently removed or banned from Qaliye, unless we have given you written permission to return;",
            "you are not required to register as a sex offender under any applicable law;",
            "you provide accurate and truthful information; and",
            "you agree to comply with these Terms and our Community Guidelines.",
          ]}
        />
        <p>
          Qaliye is strictly for adults. People under 18 are not permitted to
          create accounts, appear in dating profiles, or use the Services.
        </p>
        <p>
          Where we reasonably suspect that a user may be under 18, we may use
          additional age-estimation or age-verification measures, including
          automated photo-based age estimation or requests for identification
          documents. We will notify you if we use such measures.
        </p>
        <p>
          If we reasonably believe that you are under 18, we may request
          information to confirm your age and may restrict or terminate your
          account.
        </p>
        <p>
          If you become aware of a person under 18 using Qaliye, report the
          account immediately through the in-app reporting feature or contact{" "}
          <a
            href="mailto:support@qaliye.com"
            className="text-primary hover:underline"
          >
            support@qaliye.com
          </a>
          .
        </p>
      </Section>

      {/* Section 3 */}
      <Section number="3" title="Creating and Managing Your Account">
        <p>
          You must provide accurate, current, and complete information when
          creating and maintaining your account.
        </p>
        <p>You agree that you will:</p>
        <List
          items={[
            "create only one personal account unless we authorise otherwise;",
            "use your genuine age and identity;",
            "use photographs that you have the right to upload;",
            "keep your login credentials and devices secure;",
            "promptly update information that becomes inaccurate;",
            "notify us if you believe someone has accessed your account without permission; and",
            "remain responsible for activities performed through your account, except where caused by our failure to take reasonable security measures.",
          ]}
        />
        <p>You must not:</p>
        <List
          items={[
            "create an account for another person without authorisation;",
            "sell, transfer, rent, or share your account;",
            "impersonate another person;",
            "create fake or misleading profiles;",
            "create another account to avoid a restriction, suspension, or ban;",
            "use automated tools, bots, scripts, or scraping technologies; or",
            "falsely claim to be affiliated with Qaliye.",
          ]}
        />
        <p>
          We may use email, telephone, identity, photo, device, or other
          verification methods where reasonably necessary for safety, fraud
          prevention, or account integrity.
        </p>
        <p>
          Verification does not guarantee that a user is truthful, safe,
          trustworthy, or free from a criminal history.
        </p>
      </Section>

      {/* Section 4 */}
      <Section number="4" title="Your Responsibilities">
        <p>
          You are responsible for your conduct on and outside Qaliye when
          interacting with people you meet through the Services.
        </p>
        <p>You agree to:</p>
        <List
          items={[
            "communicate respectfully;",
            "respect consent and personal boundaries;",
            "stop contacting a user when asked;",
            "comply with applicable laws;",
            "protect your own personal and financial information;",
            "use the reporting and blocking tools when appropriate; and",
            "follow our Community Guidelines.",
          ]}
        />
        <p>You must not use Qaliye to:</p>
        <List
          items={[
            "harass, threaten, intimidate, stalk, bully, or shame another person;",
            "promote hatred or discrimination;",
            "send unsolicited sexual messages, images, or recordings;",
            "upload nudity, pornography, or sexually explicit material;",
            "exploit, sexualise, endanger, or attempt to contact a child;",
            "request, offer, promote, or facilitate sexual services;",
            "commit fraud, scams, blackmail, extortion, or financial exploitation;",
            "request money, gift cards, cryptocurrency, banking credentials, or financial assistance under false or manipulative circumstances;",
            "promote investment, trading, employment, immigration, or romance scams;",
            "advertise or sell goods or services without our written permission;",
            "distribute spam, chain messages, malware, or harmful links;",
            "collect another user\u2019s personal information without permission;",
            "share another person\u2019s private messages, images, recordings, or personal information without consent;",
            "infringe intellectual-property, privacy, publicity, or other legal rights;",
            "interfere with the security or operation of the Services;",
            "reverse engineer or attempt to extract our source code, except where the law expressly permits it;",
            "manipulate likes, matches, rankings, engagement, reviews, or platform activity;",
            "encourage unlawful, violent, dangerous, or abusive conduct; or",
            "use the Services for any purpose inconsistent with genuine adult dating and relationship-building.",
          ]}
        />
      </Section>

      {/* Section 5 */}
      <Section number="5" title="Community Guidelines">
        <p>
          Our Community Guidelines form part of these Terms.
        </p>
        <p>
          They explain the standards of behaviour and content expected from
          everyone using Qaliye. You must review and accept them before
          uploading content or interacting with other users.
        </p>
        <p>
          We may take action where content or behaviour violates the Community
          Guidelines, even if the specific conduct is not separately listed in
          these Terms.
        </p>
      </Section>

      {/* Section 6 */}
      <Section number="6" title="User Content">
        <p>
          &ldquo;User Content&rdquo; means content that you upload, create, send,
          publish, display, or otherwise make available through Qaliye,
          including:
        </p>
        <List
          items={[
            "profile photographs;",
            "profile information and biographies;",
            "interests and preferences;",
            "text messages;",
            "images sent in conversations;",
            "reports and support messages; and",
            "feedback or other submissions.",
          ]}
        />
        <Subsection number="6.1" title="Ownership">
          <p>
            You retain ownership of your User Content.
          </p>
          <p>
            You must have all rights and permissions necessary to upload and
            share that content. You must not upload content owned by someone
            else unless you have permission to use it through Qaliye.
          </p>
        </Subsection>
        <Subsection number="6.2" title="Licence granted to Qaliye">
          <p>
            By submitting User Content, you grant Qaliye a non-exclusive,
            worldwide, royalty-free, transferable and sublicensable licence to
            host, store, reproduce, process, adapt, display, distribute, and
            otherwise use the content only as reasonably necessary to:
          </p>
          <List
            items={[
              "operate and provide the Services;",
              "display your profile and content to relevant users;",
              "deliver messages and other requested features;",
              "moderate content and enforce these Terms;",
              "investigate reports, fraud, abuse, and safety incidents;",
              "maintain, secure, and improve the Services; and",
              "comply with legal obligations.",
            ]}
          />
          <p>
            This licence continues for as long as your content remains available
            through the Services or is reasonably retained for safety, legal,
            dispute-resolution, backup, or compliance purposes.
          </p>
          <p>
            We will explain our retention practices in our Privacy Policy.
          </p>
        </Subsection>
        <Subsection number="6.3" title="Responsibility for User Content">
          <p>
            You are responsible for your User Content and the consequences of
            sharing it.
          </p>
          <p>
            You must not assume that private messages or photographs will always
            remain private. Other users may take screenshots, make recordings,
            or share content without your permission, even though such behaviour
            may violate these Terms.
          </p>
          <p>
            Do not upload or send content that you would not want another person
            to save or redistribute.
          </p>
        </Subsection>
      </Section>

      {/* Section 7 */}
      <Section number="7" title="Photo and Content Moderation">
        <p>
          We use a combination of automated systems, user reports, technical
          controls, and human review where appropriate to moderate content and
          protect users.
        </p>
        <p>
          When you upload a photograph, it may be analysed using automated
          moderation technology, including <strong>Amazon Rekognition</strong>,
          to identify suspected nudity, sexually explicit material, or other
          prohibited content.
        </p>
        <p>
          If the system identifies potentially prohibited content, the
          photograph may be:
        </p>
        <List
          items={[
            "rejected before publication;",
            "hidden from other users;",
            "submitted for additional review; or",
            "removed after publication.",
          ]}
        />
        <p>You may be asked to choose and upload a different photograph.</p>
        <p>
          Automated moderation systems are not always accurate. They may
          occasionally fail to identify prohibited content or incorrectly flag
          acceptable content.
        </p>
        <p>
          We may make the final decision about whether content is permitted on
          Qaliye. Where appropriate, you may request a review of a moderation
          decision by contacting{" "}
          <a
            href="mailto:support@qaliye.com"
            className="text-primary hover:underline"
          >
            support@qaliye.com
          </a>
          .
        </p>
        <p>
          Our use of moderation technology and third-party service providers is
          described further in our Privacy Policy.
        </p>
        <p>
          You must not attempt to bypass, deceive, or interfere with our
          moderation systems.
        </p>
      </Section>

      {/* Section 8 */}
      <Section number="8" title="Reporting and Blocking">
        <p>
          Qaliye provides in-app tools that allow users to report and block
          other users.
        </p>
        <p>You may report:</p>
        <List
          items={[
            "a profile;",
            "a photograph;",
            "a message;",
            "suspected fake or underage users;",
            "harassment or threats;",
            "sexual or explicit content;",
            "scams or financial solicitation;",
            "hate speech;",
            "impersonation;",
            "spam; or",
            "other suspected violations.",
          ]}
        />
        <p>
          When you block another user, we may restrict that person&rsquo;s
          ability to:
        </p>
        <List
          items={[
            "view or discover your profile;",
            "like or match with you;",
            "send messages to you; or",
            "otherwise interact with you through Qaliye.",
          ]}
        />
        <p>
          Blocking does not necessarily remove information already received or
          retained for safety, legal, or moderation purposes.
        </p>
        <p>
          Reports must be made honestly. You must not knowingly submit false,
          malicious, retaliatory, or misleading reports.
        </p>
        <p>We may review reports and take action including:</p>
        <List
          items={[
            "issuing a warning;",
            "removing content;",
            "restricting features;",
            "removing a match;",
            "suspending an account;",
            "permanently banning an account;",
            "preserving relevant evidence;",
            "reporting conduct to law-enforcement or safeguarding authorities; or",
            "taking no action where we determine that no violation occurred.",
          ]}
        />
        <p>
          For privacy and safety reasons, we may not disclose the full details
          or outcome of an investigation.
        </p>
      </Section>

      {/* Section 9 */}
      <Section number="9" title="Safety and Interactions with Other Users">
        <p>
          Qaliye provides a platform that allows users to discover and
          communicate with each other. We do not control the actions,
          intentions, identity, statements, or conduct of every user.
        </p>
        <p>
          Unless we expressly state otherwise, Qaliye does not routinely conduct
          criminal-record, identity, immigration-status, employment, financial,
          or other background checks on all users.
        </p>
        <p>
          Profile verification, where available, is limited and does not
          guarantee that a person:
        </p>
        <List
          items={[
            "has provided completely accurate information;",
            "is safe or trustworthy;",
            "has no criminal history;",
            "intends to enter a genuine relationship; or",
            "will behave appropriately online or in person.",
          ]}
        />
        <p>
          You are responsible for deciding whether and how to interact with
          another user.
        </p>
        <p>You should:</p>
        <List
          items={[
            "avoid sending money or financial information;",
            "keep early conversations within Qaliye where possible;",
            "be cautious about sharing your address, workplace, telephone number, or identification documents;",
            "meet for the first time in a public place;",
            "tell a trusted person where you are going;",
            "arrange your own transportation;",
            "avoid becoming impaired during a first meeting;",
            "leave immediately if you feel unsafe; and",
            "contact emergency services where there is an immediate threat.",
          ]}
        />
        <p>
          Qaliye is not responsible for supervising offline meetings or private
          interactions between users.
        </p>
        <p>
          Nothing in these Terms limits any responsibility that cannot legally
          be excluded.
        </p>
      </Section>

      {/* Section 10 */}
      <Section number="10" title="Matches, Likes and Discovery">
        <p>Qaliye may provide features such as:</p>
        <List
          items={[
            "Likes;",
            "Super Likes;",
            "matches;",
            "recommendations;",
            "profile discovery;",
            "filters;",
            "rewinds;",
            "boosts;",
            "read indicators;",
            "online or activity status; and",
            "other interaction tools.",
          ]}
        />
        <p>
          A match may be created when two users express mutual interest, subject
          to our current product rules.
        </p>
        <p>We do not guarantee:</p>
        <List
          items={[
            "that another user will see your profile;",
            "that a Like or message will be delivered or answered;",
            "that profiles will appear in any particular order;",
            "that recommendations will be compatible or accurate;",
            "any minimum number of views, Likes, matches, or messages; or",
            "that a match will remain available.",
          ]}
        />
        <p>
          We may modify ranking, discovery, matching, visibility, safety, and
          recommendation systems to operate, protect, and improve the Services.
        </p>
        <p>
          Users may unmatch, withdraw an interaction, pass, block, or delete
          their accounts at any time, subject to the features available.
        </p>
      </Section>

      {/* Section 11 */}
      <Section number="11" title="Paid Services, Subscriptions and Virtual Items">
        <p>
          Qaliye may offer paid features, including subscriptions, premium
          access, Boosts, credits, or other digital benefits.
        </p>
        <p>
          The specific price, billing period, included benefits, renewal terms,
          and payment method will be displayed before you complete a purchase.
        </p>
        <Subsection number="11.1" title="App-store purchases">
          <p>
            Purchases made through Apple&rsquo;s App Store or Google Play are
            processed by the relevant app-store provider.
          </p>
          <p>
            Your payment, renewal, cancellation, and refund may also be subject
            to that provider&rsquo;s terms and procedures.
          </p>
          <p>
            You are responsible for managing app-store subscriptions through the
            relevant app-store account unless we provide another cancellation
            method.
          </p>
        </Subsection>
        <Subsection number="11.2" title="Other payment methods">
          <p>
            Where Qaliye offers web-based or local payment methods, the
            applicable price, payment instructions, duration, and renewal terms
            will be shown before purchase.
          </p>
        </Subsection>
        <Subsection number="11.3" title="Automatic renewal">
          <p>
            Where a subscription automatically renews, this will be disclosed
            before purchase.
          </p>
          <p>
            Unless cancelled before the renewal date, the subscription may renew
            for the stated period using your selected payment method.
          </p>
        </Subsection>
        <Subsection number="11.4" title="Cancelling a subscription">
          <p>
            Deleting your Qaliye account does not necessarily cancel a
            subscription purchased through Apple, Google, or another third-party
            payment provider.
          </p>
          <p>
            You must separately cancel the subscription through the provider
            that processed the purchase, unless we expressly tell you otherwise.
          </p>
          <p>
            Cancellation normally prevents future renewals. You may retain
            access until the end of the period already paid for, subject to the
            purchase terms presented to you.
          </p>
        </Subsection>
        <Subsection number="11.5" title="Refunds">
          <p>Refund eligibility depends on:</p>
          <List
            items={[
              "applicable consumer law;",
              "the payment provider\u2019s rules;",
              "the nature of the purchase; and",
              "the circumstances of the request.",
            ]}
          />
          <p>
            Nothing in these Terms removes or limits your mandatory statutory
            rights.
          </p>
        </Subsection>
        <Subsection number="11.6" title="Credits, Boosts and virtual benefits">
          <p>Credits, Boosts, Super Likes, or other virtual benefits:</p>
          <List
            items={[
              "are digital features and not legal currency;",
              "have no cash value outside Qaliye;",
              "may not be sold, transferred, or exchanged unless we expressly allow it;",
              "may be subject to limits or expiry disclosed at purchase;",
              "may be removed where obtained fraudulently or through payment reversal; and",
              "do not represent ownership of property.",
            ]}
          />
          <p>
            We will not remove paid benefits arbitrarily. Any restrictions,
            expiry rules, or material conditions will be disclosed clearly
            before purchase.
          </p>
        </Subsection>
      </Section>

      {/* Section 12 */}
      <Section number="12" title="Free Trials and Promotional Offers">
        <p>
          We may offer free trials, introductory prices, discounts, or
          promotional benefits.
        </p>
        <p>
          Eligibility and conditions may vary by user, country, platform,
          payment provider, or previous subscription history.
        </p>
        <p>Before starting a trial or promotional subscription, you will be shown:</p>
        <List
          items={[
            "the trial or promotional period;",
            "the price payable afterwards;",
            "whether the subscription renews automatically; and",
            "how to cancel.",
          ]}
        />
        <p>
          You may lose access to a promotion if you cancel, change plans, violate
          these Terms, or are no longer eligible under the stated conditions.
        </p>
      </Section>

      {/* Section 13 */}
      <Section number="13" title="Account Suspension and Termination">
        <p>
          You may stop using Qaliye at any time and may request account deletion
          through the available account settings or by contacting us.
        </p>
        <p>We may restrict, suspend, or terminate your account where we reasonably believe that:</p>
        <List
          items={[
            "you have violated these Terms or our Community Guidelines;",
            "you are under 18;",
            "you present a safety risk;",
            "you have engaged in fraud, harassment, abuse, or illegal activity;",
            "your account is fake, misleading, compromised, or being misused;",
            "you have attempted to bypass a previous restriction;",
            "your activity threatens Qaliye, its users, or third parties;",
            "suspension is required by law or a competent authority; or",
            "action is reasonably necessary to investigate a serious report.",
          ]}
        />
        <p>
          Where appropriate and legally required, we will provide notice or an
          explanation. However, we may act without advance notice where
          necessary to protect users, preserve an investigation, prevent harm,
          or comply with law.
        </p>
        <p>Termination may result in the loss of access to:</p>
        <List
          items={[
            "your profile;",
            "matches;",
            "messages;",
            "subscription features;",
            "unused promotional benefits; and",
            "other account information.",
          ]}
        />
        <p>
          Mandatory consumer rights relating to paid services remain unaffected.
        </p>
        <p>
          You may request a review of an account decision by contacting{" "}
          <a
            href="mailto:support@qaliye.com"
            className="text-primary hover:underline"
          >
            support@qaliye.com
          </a>
          . Submitting an appeal does not guarantee that the decision will be
          reversed.
        </p>
      </Section>

      {/* Section 14 */}
      <Section number="14" title="Law-Enforcement and Emergency Disclosures">
        <p>
          We may preserve, review, or disclose information where we reasonably
          believe this is necessary to:
        </p>
        <List
          items={[
            "comply with applicable law, a court order, or a lawful request;",
            "respond to an emergency involving danger, death, or serious injury;",
            "report suspected child exploitation or other serious criminal activity;",
            "prevent fraud, abuse, or threats;",
            "protect the rights and safety of users, Qaliye, or the public; or",
            "establish, exercise, or defend legal claims.",
          ]}
        />
        <p>
          Any handling of personal information is subject to our Privacy Policy
          and applicable law.
        </p>
      </Section>

      {/* Section 15 */}
      <Section number="15" title="Privacy">
        <p>
          Our{" "}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>{" "}
          explains how we collect, use, store, share, and protect personal
          information.
        </p>
        <p>
          By using Qaliye, you acknowledge that your personal information will
          be handled as described in the Privacy Policy.
        </p>
        <p>
          The Privacy Policy is available through the app and at{" "}
          <a
            href="http://www.qaliye.com"
            className="text-primary hover:underline"
          >
            www.qaliye.com
          </a>
          .
        </p>
        <p>
          The Privacy Policy should be read together with these Terms but does
          not form part of the contractual provisions unless applicable law
          requires otherwise.
        </p>
      </Section>

      {/* Section 16 */}
      <Section number="16" title="Intellectual Property">
        <p>
          Except for User Content, Qaliye and its licensors own or control all
          rights in the Services, including:
        </p>
        <List
          items={[
            "software;",
            "source code and object code;",
            "designs and layouts;",
            "databases;",
            "logos;",
            "trademarks;",
            "graphics;",
            "text;",
            "product names;",
            "algorithms; and",
            "other platform materials.",
          ]}
        />
        <p>
          We grant you a limited, personal, non-exclusive, non-transferable,
          revocable licence to access and use the Services for lawful personal
          dating purposes in accordance with these Terms.
        </p>
        <p>This licence does not permit you to:</p>
        <List
          items={[
            "copy or commercially exploit the Services;",
            "reproduce our branding without permission;",
            "resell access;",
            "create a competing database using our content;",
            "scrape user profiles;",
            "modify or distribute our software; or",
            "use Qaliye\u2019s intellectual property in a misleading or unauthorised way.",
          ]}
        />
        <p>
          &ldquo;Qaliye,&rdquo; its logo, and related branding may not be used
          without our prior written permission.
        </p>
      </Section>

      {/* Section 17 */}
      <Section number="17" title="Copyright and Other Rights Complaints">
        <p>
          If you believe content on Qaliye infringes your copyright, privacy,
          image rights, or other legal rights, contact{" "}
          <a
            href="mailto:support@qaliye.com"
            className="text-primary hover:underline"
          >
            support@qaliye.com
          </a>
          .
        </p>
        <p>Include:</p>
        <List
          items={[
            "your name and contact details;",
            "identification of the protected work or right;",
            "identification of the content complained about;",
            "the reason you believe it infringes your rights;",
            "evidence that you own or are authorised to enforce the right; and",
            "a statement that the information provided is accurate.",
          ]}
        />
        <p>We may remove or restrict content while reviewing a complaint.</p>
      </Section>

      {/* Section 18 */}
      <Section number="18" title="Third-Party Services">
        <p>The Services may rely on or link to third-party services, such as:</p>
        <List
          items={[
            "Apple and Google app stores;",
            "payment processors;",
            "cloud hosting and storage providers;",
            "authentication providers;",
            "analytics and crash-reporting services;",
            "mapping or location services;",
            "notification providers; and",
            "moderation providers such as Amazon Web Services.",
          ]}
        />
        <p>
          Third-party services are governed by their own terms and privacy
          policies.
        </p>
        <p>
          We are not responsible for third-party services that we do not
          control, but this does not affect any responsibility we have under
          applicable law for providers acting on our behalf.
        </p>
      </Section>

      {/* Section 19 */}
      <Section number="19" title="Online Safety Obligations">
        <p>
          Qaliye is a user-to-user service subject to the UK Online Safety Act
          2023 and other applicable online-safety laws.
        </p>
        <p>We are committed to:</p>
        <List
          items={[
            "removing illegal content where we become aware of it;",
            "protecting children from harmful content and preventing underage use;",
            "maintaining reporting and complaints mechanisms;",
            "conducting and updating risk assessments; and",
            "cooperating with regulators such as Ofcom where required.",
          ]}
        />
        <p>
          Our content-moderation systems, reporting tools, and Community
          Guidelines form part of our approach to online safety.
        </p>
        <p>
          You can report illegal or harmful content through the in-app reporting
          feature or by contacting{" "}
          <a
            href="mailto:support@qaliye.com"
            className="text-primary hover:underline"
          >
            support@qaliye.com
          </a>
          .
        </p>
        <p>
          Further information about our safety policies is available in our
          Community Guidelines and Transparency Report, where published.
        </p>
      </Section>

      {/* Section 20 */}
      <Section number="20" title="Service Availability and Changes">
        <p>
          We aim to provide a reliable service, but we cannot guarantee that
          Qaliye will always be:
        </p>
        <List
          items={[
            "available;",
            "uninterrupted;",
            "secure;",
            "error-free;",
            "compatible with every device; or",
            "free from delays, data loss, or technical problems.",
          ]}
        />
        <p>
          We may update, modify, suspend, replace, or discontinue features for
          reasons including:
        </p>
        <List
          items={[
            "security;",
            "safety;",
            "legal compliance;",
            "technical maintenance;",
            "product improvement;",
            "commercial viability; or",
            "prevention of abuse.",
          ]}
        />
        <p>
          Where a change materially affects a paid service, we will take
          reasonable steps to notify affected users and comply with applicable
          consumer law.
        </p>
        <p>
          You are responsible for maintaining compatible devices, operating
          systems, internet access, and app versions.
        </p>
      </Section>

      {/* Section 21 */}
      <Section number="21" title="Disclaimers">
        <p>
          Qaliye is provided as a platform for adult users to connect.
        </p>
        <p>To the extent permitted by law:</p>
        <List
          items={[
            "we do not guarantee the accuracy of user profiles;",
            "we do not endorse individual users;",
            "we do not guarantee compatibility, relationships, marriage, or personal outcomes;",
            "we do not guarantee that users will behave lawfully or appropriately;",
            "we are not responsible for statements made by users; and",
            "we are not responsible for decisions you make based solely on information supplied by another user.",
          ]}
        />
        <p>
          Nothing in these Terms excludes guarantees, warranties, or rights that
          cannot lawfully be excluded.
        </p>
      </Section>

      {/* Section 22 */}
      <Section number="22" title="Limitation of Liability">
        <p>Nothing in these Terms excludes or limits liability for:</p>
        <List
          items={[
            "death or personal injury caused by negligence;",
            "fraud or fraudulent misrepresentation;",
            "breach of rights that cannot legally be excluded;",
            "deliberate unlawful conduct; or",
            "any other liability that applicable law does not allow us to exclude.",
          ]}
        />
        <p>Subject to the above, we are not responsible for losses that:</p>
        <List
          items={[
            "were not reasonably foreseeable when you accepted these Terms;",
            "result from your violation of these Terms;",
            "arise from information or content supplied by another user;",
            "arise from an offline interaction that we did not organise or control;",
            "result from unauthorised access caused by your failure to protect your account; or",
            "relate to business, commercial, or professional use of a service intended for personal use.",
          ]}
        />
        <p>
          We are not responsible for loss of profit, business opportunity,
          business interruption, or commercial data where you use Qaliye for
          business purposes contrary to these Terms.
        </p>
        <p>
          Nothing in this section affects your statutory consumer rights.
        </p>
      </Section>

      {/* Section 23 */}
      <Section number="23" title="Your Responsibility for Loss Caused by Misuse">
        <p>
          You may be responsible for reasonable losses, costs, claims, or
          expenses that arise directly from:
        </p>
        <List
          items={[
            "your unlawful use of Qaliye;",
            "your material breach of these Terms;",
            "content you upload without the necessary rights; or",
            "fraud or deliberate misuse committed through your account.",
          ]}
        />
        <p>
          You will not be responsible to the extent that the loss was caused by
          Qaliye&rsquo;s own breach, negligence, or failure to take reasonable
          steps.
        </p>
      </Section>

      {/* Section 24 */}
      <Section number="24" title="Changes to These Terms">
        <p>We may update these Terms to reflect:</p>
        <List
          items={[
            "changes to the Services;",
            "new features;",
            "changes in law or regulation;",
            "safety or security requirements;",
            "changes to payment arrangements; or",
            "improvements in clarity.",
          ]}
        />
        <p>
          The updated Terms will show a revised &ldquo;Last updated&rdquo; date.
        </p>
        <p>
          Where changes are material, we will provide reasonable notice through
          the app, website, email, or another appropriate method.
        </p>
        <p>
          We may ask you to accept updated Terms before continuing to use the
          Services.
        </p>
        <p>
          Changes will not apply retrospectively where doing so would unfairly
          reduce rights already acquired.
        </p>
      </Section>

      {/* Section 25 */}
      <Section number="25" title="Communications">
        <p>
          We may send you service-related communications concerning:
        </p>
        <List
          items={[
            "account security;",
            "matches and messages;",
            "moderation decisions;",
            "reports;",
            "subscriptions and payments;",
            "changes to the Services;",
            "changes to legal documents; and",
            "support requests.",
          ]}
        />
        <p>
          Service communications may be necessary to operate your account and
          may not always be optional.
        </p>
        <p>
          Marketing communications will be managed separately and may be
          disabled using the provided unsubscribe or preference controls,
          subject to applicable law.
        </p>
      </Section>

      {/* Section 26 */}
      <Section number="26" title="Governing Law and Courts">
        <p>
          These Terms and any non-contractual dispute arising from them are
          governed by the laws of <strong>England and Wales</strong>.
        </p>
        <p>
          If you live in England or Wales, the courts of England and Wales will
          have jurisdiction.
        </p>
        <p>
          If you live in Scotland, Northern Ireland, or another country, you may
          also have the right to bring proceedings in your local courts where
          mandatory consumer law provides that right.
        </p>
        <p>
          Nothing in these Terms prevents you from relying on mandatory consumer
          protections that apply in the country where you normally live.
        </p>
        <p>
          If you are a consumer in the European Economic Area, you may also have
          the right to bring proceedings in the country where you normally live,
          and mandatory EU consumer-protection laws will apply.
        </p>
        <p>
          Before beginning legal proceedings, we encourage you to contact{" "}
          <a
            href="mailto:support@qaliye.com"
            className="text-primary hover:underline"
          >
            support@qaliye.com
          </a>{" "}
          so that we can attempt to resolve the matter.
        </p>
        <Subsection number="26.1" title="Alternative Dispute Resolution">
          <p>
            Under UK and EU consumer law, you may have the right to use
            alternative dispute resolution (ADR) to resolve a dispute with us
            without going to court.
          </p>
          <p>
            In the UK, the competent ADR body for consumer disputes is [INSERT
            ADR PROVIDER NAME AND WEBSITE — e.g. the Centre for Effective
            Dispute Resolution (CEDR) at cedr.com]. We are not currently obliged
            to participate in an ADR scheme but may do so voluntarily.
          </p>
          <p>
            In the EU, you may submit a complaint through the European Online
            Dispute Resolution platform at{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              className="text-primary hover:underline"
            >
              ec.europa.eu/consumers/odr
            </a>
            .
          </p>
        </Subsection>
      </Section>

      {/* Section 27 */}
      <Section number="27" title="General Provisions">
        <Subsection number="27.1" title="Entire agreement">
          <p>
            These Terms, the Privacy Policy, the Community Guidelines, and any
            purchase-specific terms presented to you form the agreement
            governing your use of Qaliye.
          </p>
        </Subsection>
        <Subsection number="27.2" title="Severability">
          <p>
            If any provision is found unlawful or unenforceable, the remaining
            provisions will continue to apply. The affected provision will be
            interpreted or reduced only to the extent necessary to make it
            enforceable.
          </p>
        </Subsection>
        <Subsection number="27.3" title="No waiver">
          <p>
            If we delay or fail to enforce a provision, this does not mean that
            we waive the right to enforce it later.
          </p>
        </Subsection>
        <Subsection number="27.4" title="Assignment">
          <p>
            You may not transfer your rights or obligations under these Terms
            without our written permission.
          </p>
          <p>
            We may transfer our rights or obligations as part of a business
            reorganisation, sale, transfer, or change of legal structure,
            provided that this does not reduce your mandatory rights.
          </p>
        </Subsection>
        <Subsection number="27.5" title="No partnership or agency">
          <p>
            These Terms do not create an employment, partnership, joint venture,
            fiduciary, franchise, or agency relationship between you and Qaliye.
          </p>
        </Subsection>
        <Subsection number="27.6" title="Third-party rights">
          <p>
            Unless expressly stated otherwise, a person who is not a party to
            these Terms does not have a right to enforce them.
          </p>
        </Subsection>
        <Subsection number="27.7" title="Headings">
          <p>
            Section headings are included for convenience and do not affect
            interpretation.
          </p>
        </Subsection>
        <Subsection number="27.8" title="Language">
          <p>
            We may provide translations of these Terms for convenience.
          </p>
          <p>
            Unless applicable law requires otherwise, the English version will
            govern if there is a conflict between the English version and a
            translation.
          </p>
        </Subsection>
      </Section>

      {/* Section 28 */}
      <Section number="28" title="Contact Us">
        <p>
          Questions, complaints, appeals, and legal notices relating to these
          Terms may be sent to:
        </p>
        <div className="space-y-1">
          <p>
            <strong>Qaliye</strong>
          </p>
          <p>
            Operated by <strong>[YOUR FULL LEGAL NAME], trading as Qaliye</strong>
          </p>
          <p>
            <strong>Address:</strong> [YOUR BUSINESS ADDRESS]
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:support@qaliye.com"
              className="text-primary hover:underline"
            >
              support@qaliye.com
            </a>
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a
              href="http://www.qaliye.com"
              className="text-primary hover:underline"
            >
              www.qaliye.com
            </a>
          </p>
        </div>
      </Section>

      <p className="text-text-secondary italic text-sm pt-4 border-t border-border">
        These Terms of Use are provided for informational purposes and do not
        constitute legal advice. You should have a qualified solicitor review
        this document before publication.
      </p>
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 mb-8">
      <h2 className="text-xl font-bold text-text-primary">
        {number}. {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Subsection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 ml-4">
      <h3 className="text-lg font-semibold text-text-primary">
        {number} {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
