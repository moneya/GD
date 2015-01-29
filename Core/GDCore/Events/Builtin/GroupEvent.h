/*
 * GDevelop Core
 * Copyright 2008-2015 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */

#if defined(GD_IDE_ONLY)
#ifndef GDCORE_GROUPEVENT_H
#define GDCORE_GROUPEVENT_H
#include "GDCore/Events/Event.h"
#include "GDCore/Events/Instruction.h"
#include "GDCore/Events/EventsList.h"
namespace gd { class Instruction; }
namespace gd { class Project; }
class RuntimeScene;
class TiXmlElement;
class EventsCodeGenerationContext;
namespace gd { class EventsEditorItemsAreas; }
namespace gd { class EventsEditorSelection; }

namespace gd
{

/**
 * \brief A group event, containing only sub events and some (visual only) properties.
 */
class GD_CORE_API GroupEvent : public gd::BaseEvent
{
public:
    GroupEvent();
    virtual ~GroupEvent() {};
    virtual gd::GroupEvent * Clone() const { return new GroupEvent(*this);}

    virtual bool IsExecutable() const {return true;}

    /**
     * \brief Get the name of the group.
     */
    const std::string & GetName() const { return name; }

    /**
     * \brief Change the name of the group.
     */
    void SetName(const std::string & name_) { name = name_; }

    /**
     * \brief Get the source of the group.
     * \note The source is usually an URL from which
     * the group and its events was downloaded.
     */
    const std::string & GetSource() const { return source; }

    /**
     * \brief Set the source of the group.
     */
    void SetSource(const std::string & source_) { source = source_; }

    /**
     * \brief Get the vector containing the parameters that have been used to
     * create the group and its sub events.
     * \note These parameters are optional and only used to remember how the
     * group was created from an events template for example: if the user wants
     * to update the group with a new version of the template, the parameters
     * can be displayed again to easy the update.
     */
    std::vector<std::string> & GetCreationParameters() { return parameters; }
    const std::vector<std::string> & GetCreationParameters() const { return parameters; }

    /**
     * \brief Return the creation timestamp
     * \return The timestamp, or 0 if not specified for the group.
     */
    unsigned int GetCreationTimestamp() const { return creationTime; }

    /**
     * \brief Set timestamp of the creation of the group.
     * \note This is purely optional and only used for checking for example if
     * a new version of the group is available, if it has a source URL.
     */
    void SetCreationTimestamp(unsigned int creationTime_) { creationTime = creationTime_; }

    /**
     * \brief Change the color of the group
     */
    void SetBackgroundColor(unsigned int colorR, unsigned int colorG, unsigned int colorB);

    /**
     * \brief Get background color red component.
     */
    unsigned int GetBackgroundColorR() const { return colorR; };

    /**
     * \brief Get background color green component.
     */
    unsigned int GetBackgroundColorG() const { return colorG; };

    /**
     * \brief Get background color blue component.
     */
    unsigned int GetBackgroundColorB() const { return colorB; };

    virtual bool CanHaveSubEvents() const {return true;}
    virtual const gd::EventsList & GetSubEvents() const {return events;};
    virtual gd::EventsList & GetSubEvents() {return events;};

    virtual void SerializeTo(SerializerElement & element) const;
    virtual void UnserializeFrom(gd::Project & project, const SerializerElement & element);

    virtual gd::BaseEvent::EditEventReturnType EditEvent(wxWindow* parent_, gd::Project & project, gd::Layout & scene, gd::MainFrameWrapper & mainFrameWrapper);

    /**
     * Called by event editor to draw the event.
     */
    virtual void Render(wxDC & dc, int x, int y, unsigned int width, gd::EventsEditorItemsAreas & areas, gd::EventsEditorSelection & selection, const gd::Platform & platform);

    /**
     * Must return the height of the event when rendered
     */
    virtual unsigned int GetRenderedHeight(unsigned int width, const gd::Platform & platform) const;

private:
    EventsList events;

    std::string name; ///<Optional. A name displayed in the events editor.
    std::string source; ///< Optional. The source can contains the URL from which the group was downloaded.
    unsigned int creationTime; ///< Optional. The time when the group was created from an event template.
    std::vector<std::string> parameters; ///< Optional. Can be used to remember the parameters used if the group was created from an events template.
    unsigned int colorR;
    unsigned int colorG;
    unsigned int colorB;
};

}

#endif // GDCORE_GROUPEVENT_H
#endif